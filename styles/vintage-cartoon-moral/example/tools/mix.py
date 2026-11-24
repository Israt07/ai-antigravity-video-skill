"""Vintage Cartoon Moral soundtrack: narration + 1930s foley sound effects + vintage muted score, all made in numpy.
No samples, no AI audio, no downloads.

  python3 tools/mix.py [project=.]          → data/mix.wav (48 kHz stereo)

Reads data/cues.json (node tools/capture.mjs cues), data/narration.wav if it exists (voice.py or words.py --audio),
and script.json "music": "vintage_moral" (the procedural score, default) · "bed" · "none" · "audio/your-track.mp3".
The music ducks under the voice.

Sound rules:
- Foley: paper, pen, clock, tock, slide, whoosh, thud.
- Music: Low ambient drone + slow muted vintage piano arpeggios in D minor, softly filtered below 2.5 kHz.
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from scipy import signal
from scipy.io import wavfile

P = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
SR = 48000
rng = np.random.default_rng(1930)
cj = json.loads((P / 'data/cues.json').read_text(encoding='utf-8'))
script = json.loads((P / 'script.json').read_text(encoding='utf-8'))
DUR = float(cj['duration'])
N = int(DUR * SR) + SR // 10


def lp(x, f, o=2):
    b, a = signal.butter(o, min(f, SR / 2 - 100) / (SR / 2), 'low')
    return signal.lfilter(b, a, x)

def hp(x, f, o=2):
    b, a = signal.butter(o, f / (SR / 2), 'high')
    return signal.lfilter(b, a, x)

def bp(x, f0, f1, o=2):
    b, a = signal.butter(o, [f0 / (SR / 2), f1 / (SR / 2)], 'band')
    return signal.lfilter(b, a, x)

def db(x):
    return 10 ** (x / 20)

def tt(d):
    return np.arange(int(d * SR)) / SR

def env(n, a=0.005, r=None):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    rest = n - na
    e[na:] = np.exp(-np.linspace(0, r or 5, rest)) if rest > 0 else 1
    return e

def sweep(f0, f1, d, shape='exp'):
    t = tt(d)
    f = f0 * (f1 / f0) ** (t / d) if shape == 'exp' else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

def noise(d):
    return rng.standard_normal(int(d * SR))


# ---------- 1930s Foley Effects ----------
def whoosh(d=0.38, **_):
    n = noise(d)
    lo, hi = lp(n, 450), lp(n, 1800)
    k = np.sin(np.pi * np.linspace(0, 1, len(n)))
    x = (lo * (1 - k) + hi * k) * k ** 1.5
    return x / (np.abs(x).max() + 1e-9) * 0.5

def slide(d=0.8, **_):
    # Smooth wooden surface slide
    n = bp(noise(d), 300, 1200)
    e = np.sin(np.pi * np.linspace(0, 1, len(n))) ** 2
    return n / (np.abs(n).max() + 1e-9) * e * 0.4

def clock(d=3.0, **_):
    # Antique grandfather clock / pendulum tick-tock
    x = np.zeros(int(d * SR))
    interval = int(0.75 * SR)
    for pos in range(0, len(x) - int(0.1 * SR), interval):
        # Alternate tick and tock pitch
        f = 920 if (pos // interval) % 2 == 0 else 760
        click = np.sin(2 * np.pi * f * tt(0.04)) * env(int(0.04 * SR), 0.001, 25)
        x[pos:pos + len(click)] += lp(click, 1800) * 0.6
    return x

def tock(**_):
    d = 0.06
    x = np.sin(2 * np.pi * 680 * tt(d)) * env(int(d * SR), 0.001, 20)
    return lp(x, 1500) * 0.7

def pen(d=0.9, **_):
    # Fountain pen scratching on textured parchment
    n = hp(bp(noise(d), 1500, 4200), 1200)
    mod = (np.sin(2 * np.pi * 14 * tt(d)) + 1) * 0.5
    e = env(len(n), 0.02, 3)
    return n * mod * e * 0.45

def paper(d=0.6, **_):
    # Parchment rustle
    n = bp(noise(d), 400, 2400)
    e = np.sin(np.pi * np.linspace(0, 1, len(n))) ** 1.5
    return n * e * 0.5

def thud(**_):
    d = 0.28
    x = sweep(140, 45, d) * env(int(d * SR), 0.005, 7)
    return lp(x, 300) * 0.85

def whistle(d=1.4, **_):
    # Distant 1930s steam train twin-tone whistle
    t = tt(d)
    w1 = np.sin(2 * np.pi * 440 * t)
    w2 = np.sin(2 * np.pi * 554.37 * t)
    n = bp(noise(d), 300, 2000) * 0.12
    e = env(len(t), 0.18, 2.2)
    x = (w1 * 0.6 + w2 * 0.5 + n) * e
    return bp(x, 250, 1800) * 0.7

FX = {
    'whoosh': whoosh,
    'slide': slide,
    'clock': clock,
    'tock': tock,
    'pen': pen,
    'paper': paper,
    'thud': thud,
    'whistle': whistle
}

LEVEL = {
    'whoosh': -6,
    'slide': -8,
    'clock': -10,
    'tock': -9,
    'pen': -8,
    'paper': -8,
    'thud': -5,
    'whistle': -7
}


# ---------- 1930s Vintage Moral Score ----------
def music_vintage_moral():
    """Low warm drone + slow muted vintage piano arpeggios in D minor ducked under the voice"""
    t = np.arange(N) / SR
    x = np.zeros(N)

    # 1. Warm sub drone (58 Hz & 87 Hz)
    drone = np.sin(2 * np.pi * 58.27 * t) * 0.4 + np.sin(2 * np.pi * 87.31 * t) * 0.25
    drone *= 0.7 + 0.3 * np.sin(2 * np.pi * t / 6.0) ** 2
    x += drone

    # 2. Muted vintage piano notes (D minor: D3, F3, A3, C4, D4, Bb3)
    def piano_note(f, d=1.4):
        dur_samples = int(d * SR)
        nt = np.arange(dur_samples) / SR
        # Harmonic series with soft falloff
        s = np.sin(2 * np.pi * f * nt) * 0.7
        s += np.sin(2 * np.pi * f * 2 * nt) * 0.22
        s += np.sin(2 * np.pi * f * 3 * nt) * 0.08
        e = env(dur_samples, a=0.004, r=4.2)
        return lp(s * e, 1600)

    # Arpeggio pattern (slow, deliberate, haunting)
    notes = [146.83, 174.61, 220.00, 261.63, 293.66, 233.08] # D3, F3, A3, C4, D4, Bb3
    beat = 1.35 # seconds per note
    total_beats = int(DUR / beat)

    for b in range(total_beats):
        pos = int(b * beat * SR)
        f_note = notes[b % len(notes)]
        note_wav = piano_note(f_note, d=1.8) * 0.32
        end_pos = min(len(x), pos + len(note_wav))
        if pos < len(x):
            x[pos:end_pos] += note_wav[:end_pos - pos]

    # Warm vintage band-pass filter (100 Hz to 2800 Hz) to simulate 1930s optical sound track
    x = bp(x, 90, 2800)

    # Fade in/out
    fade = np.ones(N)
    fo = int(1.5 * SR)
    fade[-fo:] = np.linspace(1, 0, fo)
    fi = int(0.8 * SR)
    fade[:fi] *= np.linspace(0, 1, fi)
    x = (x / (np.abs(x).max() + 1e-9)) * fade
    return x

def music_bed():
    return music_vintage_moral()

def load_audio(f):
    out = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(f), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
        capture_output=True,
        check=True
    ).stdout
    return np.frombuffer(out, dtype=np.float32).reshape(-1, 2).astype(np.float64)


mix = np.zeros((N, 2))

# Voice
vf = P / 'data/narration.wav'
voice = None
if vf.exists():
    v = load_audio(vf)[:N]
    voice = np.zeros((N, 2))
    voice[:len(v)] = v
    rms = np.sqrt(np.mean(voice ** 2) + 1e-12)
    voice *= db(-19) / rms
    mix += voice

# Music
mus = script.get('music', 'vintage_moral')
if mus and mus != 'none':
    m = music_vintage_moral() if mus in ('vintage_moral', 'bed', 'tension') else None
    if m is None:
        a = load_audio(P / mus)[:N]
        m = np.zeros(N)
        m[:len(a)] = a.mean(1)
        m /= np.abs(m).max() + 1e-9
    m = np.stack([m, m], 1) * db(-24 if voice is not None else -20)
    if voice is not None:
        # Duck under the voice
        lev = np.abs(voice.mean(1))
        lev = signal.lfilter([1 - 0.9995], [1, -0.9995], lev)
        lev /= lev.max() + 1e-9
        m *= (1 - 0.55 * np.clip(lev * 3, 0, 1))[:, None]
    mix += m

# Effects
for c in cj['cues']:
    fn = FX.get(c['type'])
    if not fn:
        print('unknown cue type, skipped:', c['type'])
        continue
    x = fn(**({'d': c['dur']} if c.get('dur') else {}))
    x = lp(x, 4500) * db(LEVEL.get(c['type'], -8)) * c.get('gain', 1.0) / (np.abs(x).max() + 1e-9) * 0.9
    i = int(c['t'] * SR)
    n = min(len(x), N - i)
    if n > 0 and i >= 0:
        pan = c.get('pan', 0.0)
        mix[i:i + n, 0] += x[:n] * (1 - max(0, pan))
        mix[i:i + n, 1] += x[:n] * (1 + min(0, pan))

# Master: gentle soft-clip, peak -1 dBFS
mix = np.tanh(mix * 1.2) / 1.2
mix *= db(-1) / (np.abs(mix).max() + 1e-9)
wavfile.write(P / 'data/mix.wav', SR, (mix * 32767).astype(np.int16))
print(f"data/mix.wav: {DUR:.2f} s · voice: {'yes' if voice is not None else 'NO (captions-only)'} · music: {mus} · {len(cj['cues'])} cues")
