import { SPOTIFY_API_URL, getSpotifyAccessToken } from '@/lib/spotify';
import { getStoredRefreshToken } from '@/lib/spotify-token';
import { NextResponse } from 'next/server';

const IDLE_MESSAGE = 'Not listening to Spotify right now.';

type SpotifyArtist = { name: string };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
  duration_ms: number;
};

function idleResponse(
  reason?: 'missing_credentials' | 'invalid_token' | 'no_data',
) {
  const setupRequired =
    reason === 'missing_credentials' || reason === 'invalid_token';

  return NextResponse.json(
    {
      playing: false,
      idle: true,
      message: IDLE_MESSAGE,
      ...(setupRequired
        ? { setupRequired: true, reason }
        : reason
          ? { reason }
          : {}),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    },
  );
}

function trackResponse(track: ReturnType<typeof formatTrack>) {
  return NextResponse.json(track, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
  });
}

function formatTrack(track: SpotifyTrack, isPlaying: boolean, progress = 0) {
  return {
    playing: true,
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    albumImageUrl: track.album.images[0]?.url ?? '',
    songUrl: track.external_urls.spotify,
    progress,
    duration: track.duration_ms,
    label: isPlaying ? 'Now Playing' : 'Last Played',
  };
}

async function getRecentlyPlayedTrack(
  accessToken: string,
): Promise<ReturnType<typeof formatTrack> | null> {
  const recentResponse = await fetch(
    `${SPOTIFY_API_URL}/me/player/recently-played?limit=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    },
  );

  if (!recentResponse.ok) return null;

  const recent = await recentResponse.json();
  const track = recent.items?.[0]?.track as SpotifyTrack | undefined;
  if (!track) return null;

  return formatTrack(track, false, 0);
}

type LastFmImage = { '#text': string; size: string };
type LastFmTrack = {
  name: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: LastFmImage[];
  url: string;
  date?: { uts: string };
  '@attr'?: { nowplaying: string };
};

// Last.fm fallback for Spotify Free accounts: Spotify's Web API returns 403
// on player endpoints without Premium, but Last.fm scrobbling works on Free.
async function getLastFmTrack(): Promise<ReturnType<typeof formatTrack> | null> {
  const apiKey = process.env.LASTFM_API_KEY?.trim();
  const username = process.env.LASTFM_USERNAME?.trim();
  if (!apiKey || !username) return null;

  try {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: username,
      api_key: apiKey,
      format: 'json',
      limit: '2',
    });
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const data = await res.json();
    const raw = data?.recenttracks?.track;
    const tracks: LastFmTrack[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const track = tracks[0];
    if (!track?.name) return null;

    const images = Array.isArray(track.image) ? track.image : [];
    const pick = (size: string) => images.find((i) => i.size === size)?.['#text'];
    const albumImageUrl =
      pick('extralarge') || pick('large') || pick('medium') || pick('small') || '';

    const isPlaying = track['@attr']?.nowplaying === 'true';
    return {
      playing: true,
      isPlaying,
      title: track.name,
      artist: track.artist?.['#text'] ?? '',
      albumImageUrl,
      songUrl: track.url ?? '',
      progress: 0,
      duration: 0,
      label: isPlaying ? 'Now Playing' : 'Last Played',
    };
  } catch {
    return null;
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = await getStoredRefreshToken();

  if (!clientId || !clientSecret || !refreshToken) {
    return idleResponse('missing_credentials');
  }

  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    return idleResponse('invalid_token');
  }

  try {
    const currentResponse = await fetch(
      `${SPOTIFY_API_URL}/me/player/currently-playing`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );

    if (currentResponse.status === 200) {
      const song = await currentResponse.json();
      if (song?.item) {
        return trackResponse(
          formatTrack(
            song.item,
            Boolean(song.is_playing),
            song.progress_ms ?? 0,
          ),
        );
      }
    }
  } catch {
    // fall through to recently-played
  }

  // 204 = nothing playing; also fall back when 200 has no track or
  // currently-playing is unavailable (e.g. 403 without Premium)
  const recentTrack = await getRecentlyPlayedTrack(accessToken);
  if (recentTrack) return trackResponse(recentTrack);

  // Last.fm fallback (works with Spotify Free via scrobbling)
  const lastFmTrack = await getLastFmTrack();
  if (lastFmTrack) return trackResponse(lastFmTrack);

  return idleResponse('no_data');
}
