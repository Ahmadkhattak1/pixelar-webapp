import { useState, useEffect, useRef } from "react";
import { Play, Pause, Save, Settings2, Grid3X3, Clock, Move, Wand2, Loader2, Download, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GIF from "gif.js";

interface SpriteSheetConverterProps {
    spriteSheetUrl: string;
    onSave: (gifUrl: string) => void;
}

// Inline worker script as a blob URL to avoid CORS issues
const workerBlob = new Blob([`
(function() {
    var NeuQuant = (function() {
        var ncycles = 100;
        var netsize = 256;
        var maxnetpos = netsize - 1;
        var netbiasshift = 4;
        var intbiasshift = 16;
        var intbias = 1 << intbiasshift;
        var gammashift = 10;
        var gamma = 1 << gammashift;
        var betashift = 10;
        var beta = intbias >> betashift;
        var betagamma = intbias << (gammashift - betashift);
        var initrad = netsize >> 3;
        var radiusbiasshift = 6;
        var radiusbias = 1 << radiusbiasshift;
        var initradius = initrad * radiusbias;
        var radiusdec = 30;
        var alphabiasshift = 10;
        var initalpha = 1 << alphabiasshift;
        var alphadec;
        var radbiasshift = 8;
        var radbias = 1 << radbiasshift;
        var alpharadbshift = alphabiasshift + radbiasshift;
        var alpharadbias = 1 << alpharadbshift;
        var prime1 = 499;
        var prime2 = 491;
        var prime3 = 487;
        var prime4 = 503;
        var minpicturebytes = 3 * prime4;

        function NeuQuant(pixels, samplefac) {
            var network;
            var netindex;
            var bias;
            var freq;
            var radpower;

            function init() {
                network = [];
                netindex = new Int32Array(256);
                bias = new Int32Array(netsize);
                freq = new Int32Array(netsize);
                radpower = new Int32Array(netsize >> 3);
                var i, v;
                for (i = 0; i < netsize; i++) {
                    v = (i << (netbiasshift + 8)) / netsize;
                    network[i] = new Float64Array([v, v, v, 0]);
                    freq[i] = intbias / netsize;
                    bias[i] = 0;
                }
            }

            function unbiasnet() {
                for (var i = 0; i < netsize; i++) {
                    network[i][0] >>= netbiasshift;
                    network[i][1] >>= netbiasshift;
                    network[i][2] >>= netbiasshift;
                    network[i][3] = i;
                }
            }

            function altersingle(alpha, i, b, g, r) {
                network[i][0] -= (alpha * (network[i][0] - b)) / initalpha;
                network[i][1] -= (alpha * (network[i][1] - g)) / initalpha;
                network[i][2] -= (alpha * (network[i][2] - r)) / initalpha;
            }

            function alterneigh(radius, i, b, g, r) {
                var lo = Math.abs(i - radius);
                var hi = Math.min(i + radius, netsize);
                var j = i + 1;
                var k = i - 1;
                var m = 1;
                var p, a;
                while (j < hi || k > lo) {
                    a = radpower[m++];
                    if (j < hi) {
                        p = network[j++];
                        p[0] -= (a * (p[0] - b)) / alpharadbias;
                        p[1] -= (a * (p[1] - g)) / alpharadbias;
                        p[2] -= (a * (p[2] - r)) / alpharadbias;
                    }
                    if (k > lo) {
                        p = network[--k];
                        p[0] -= (a * (p[0] - b)) / alpharadbias;
                        p[1] -= (a * (p[1] - g)) / alpharadbias;
                        p[2] -= (a * (p[2] - r)) / alpharadbias;
                    }
                }
            }

            function contest(b, g, r) {
                var bestd = ~(1 << 31);
                var bestbiasd = bestd;
                var bestpos = -1;
                var bestbiaspos = bestpos;
                var i, n, dist, biasdist, betafreq;
                for (i = 0; i < netsize; i++) {
                    n = network[i];
                    dist = Math.abs(n[0] - b) + Math.abs(n[1] - g) + Math.abs(n[2] - r);
                    if (dist < bestd) {
                        bestd = dist;
                        bestpos = i;
                    }
                    biasdist = dist - (bias[i] >> (intbiasshift - netbiasshift));
                    if (biasdist < bestbiasd) {
                        bestbiasd = biasdist;
                        bestbiaspos = i;
                    }
                    betafreq = freq[i] >> betashift;
                    freq[i] -= betafreq;
                    bias[i] += betafreq << gammashift;
                }
                freq[bestpos] += beta;
                bias[bestpos] -= betagamma;
                return bestbiaspos;
            }

            function inxbuild() {
                var i, j, p, q, smallpos, smallval, previouscol = 0, startpos = 0;
                for (i = 0; i < netsize; i++) {
                    p = network[i];
                    smallpos = i;
                    smallval = p[1];
                    for (j = i + 1; j < netsize; j++) {
                        q = network[j];
                        if (q[1] < smallval) {
                            smallpos = j;
                            smallval = q[1];
                        }
                    }
                    q = network[smallpos];
                    if (i != smallpos) {
                        j = q[0]; q[0] = p[0]; p[0] = j;
                        j = q[1]; q[1] = p[1]; p[1] = j;
                        j = q[2]; q[2] = p[2]; p[2] = j;
                        j = q[3]; q[3] = p[3]; p[3] = j;
                    }
                    if (smallval != previouscol) {
                        netindex[previouscol] = (startpos + i) >> 1;
                        for (j = previouscol + 1; j < smallval; j++) netindex[j] = i;
                        previouscol = smallval;
                        startpos = i;
                    }
                }
                netindex[previouscol] = (startpos + maxnetpos) >> 1;
                for (j = previouscol + 1; j < 256; j++) netindex[j] = maxnetpos;
            }

            function learn() {
                var i;
                var lengthcount = pixels.length;
                var alphadec = 30 + ((samplefac - 1) / 3);
                var samplepixels = lengthcount / (3 * samplefac);
                var delta = ~~(samplepixels / ncycles);
                var alpha = initalpha;
                var radius = initradius;
                var rad = radius >> radiusbiasshift;
                if (rad <= 1) rad = 0;
                for (i = 0; i < rad; i++) radpower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));
                var step;
                if (lengthcount < minpicturebytes) {
                    samplefac = 1;
                    step = 3;
                } else if (lengthcount % prime1 !== 0) {
                    step = 3 * prime1;
                } else if (lengthcount % prime2 !== 0) {
                    step = 3 * prime2;
                } else if (lengthcount % prime3 !== 0) {
                    step = 3 * prime3;
                } else {
                    step = 3 * prime4;
                }
                var b, g, r, j;
                var pix = 0;
                i = 0;
                while (i < samplepixels) {
                    b = (pixels[pix] & 0xff) << netbiasshift;
                    g = (pixels[pix + 1] & 0xff) << netbiasshift;
                    r = (pixels[pix + 2] & 0xff) << netbiasshift;
                    j = contest(b, g, r);
                    altersingle(alpha, j, b, g, r);
                    if (rad !== 0) alterneigh(rad, j, b, g, r);
                    pix += step;
                    if (pix >= lengthcount) pix -= lengthcount;
                    i++;
                    if (delta === 0) delta = 1;
                    if (i % delta === 0) {
                        alpha -= alpha / alphadec;
                        radius -= radius / radiusdec;
                        rad = radius >> radiusbiasshift;
                        if (rad <= 1) rad = 0;
                        for (j = 0; j < rad; j++) radpower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));
                    }
                }
            }

            function buildColormap() {
                init();
                learn();
                unbiasnet();
                inxbuild();
            }
            this.buildColormap = buildColormap;

            function getColormap() {
                var map = [];
                var index = [];
                for (var i = 0; i < netsize; i++) index[network[i][3]] = i;
                var k = 0;
                for (var l = 0; l < netsize; l++) {
                    var j = index[l];
                    map[k++] = network[j][0];
                    map[k++] = network[j][1];
                    map[k++] = network[j][2];
                }
                return map;
            }
            this.getColormap = getColormap;

            function inxsearch(b, g, r) {
                var a, p, dist;
                var bestd = 1000;
                var best = -1;
                var i = netindex[g];
                var j = i - 1;
                while (i < netsize || j >= 0) {
                    if (i < netsize) {
                        p = network[i];
                        dist = p[1] - g;
                        if (dist >= bestd) i = netsize;
                        else {
                            i++;
                            if (dist < 0) dist = -dist;
                            a = p[0] - b;
                            if (a < 0) a = -a;
                            dist += a;
                            if (dist < bestd) {
                                a = p[2] - r;
                                if (a < 0) a = -a;
                                dist += a;
                                if (dist < bestd) {
                                    bestd = dist;
                                    best = p[3];
                                }
                            }
                        }
                    }
                    if (j >= 0) {
                        p = network[j];
                        dist = g - p[1];
                        if (dist >= bestd) j = -1;
                        else {
                            j--;
                            if (dist < 0) dist = -dist;
                            a = p[0] - b;
                            if (a < 0) a = -a;
                            dist += a;
                            if (dist < bestd) {
                                a = p[2] - r;
                                if (a < 0) a = -a;
                                dist += a;
                                if (dist < bestd) {
                                    bestd = dist;
                                    best = p[3];
                                }
                            }
                        }
                    }
                }
                return best;
            }
            this.lookupRGB = inxsearch;
        }

        return NeuQuant;
    })();

    var LZWEncoder = (function() {
        var EOF = -1;
        var BITS = 12;
        var HSIZE = 5003;
        var masks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F, 0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF, 0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];

        function LZWEncoder(width, height, pixels, colorDepth) {
            var initCodeSize = Math.max(2, colorDepth);
            var accum = new Uint8Array(256);
            var htab = new Int32Array(HSIZE);
            var codetab = new Int32Array(HSIZE);
            var cur_accum, cur_bits = 0;
            var a_count;
            var free_ent = 0;
            var maxcode;
            var clear_flg = false;
            var g_init_bits, ClearCode, EOFCode;
            var remaining, curPixel;
            var out = [];

            function char_out(c) {
                accum[a_count++] = c;
                if (a_count >= 254) flush_char();
            }

            function cl_block() {
                cl_hash(HSIZE);
                free_ent = ClearCode + 2;
                clear_flg = true;
                output(ClearCode);
            }

            function cl_hash(hsize) {
                for (var i = 0; i < hsize; ++i) htab[i] = -1;
            }

            function compress(init_bits) {
                var fcode, c, i, ent, disp, hsize_reg, hshift;
                g_init_bits = init_bits;
                clear_flg = false;
                n_bits = g_init_bits;
                maxcode = (1 << n_bits) - 1;
                ClearCode = 1 << (init_bits - 1);
                EOFCode = ClearCode + 1;
                free_ent = ClearCode + 2;
                a_count = 0;
                ent = nextPixel();
                hshift = 0;
                for (fcode = HSIZE; fcode < 65536; fcode *= 2) ++hshift;
                hshift = 8 - hshift;
                hsize_reg = HSIZE;
                cl_hash(hsize_reg);
                output(ClearCode);
                outer_loop: while ((c = nextPixel()) != EOF) {
                    fcode = (c << BITS) + ent;
                    i = (c << hshift) ^ ent;
                    if (htab[i] === fcode) {
                        ent = codetab[i];
                        continue;
                    } else if (htab[i] >= 0) {
                        disp = hsize_reg - i;
                        if (i === 0) disp = 1;
                        do {
                            if ((i -= disp) < 0) i += hsize_reg;
                            if (htab[i] === fcode) {
                                ent = codetab[i];
                                continue outer_loop;
                            }
                        } while (htab[i] >= 0);
                    }
                    output(ent);
                    ent = c;
                    if (free_ent < 1 << BITS) {
                        codetab[i] = free_ent++;
                        htab[i] = fcode;
                    } else {
                        cl_block();
                    }
                }
                output(ent);
                output(EOFCode);
            }

            function flush_char() {
                if (a_count > 0) {
                    out.push(a_count);
                    for (var i = 0; i < a_count; i++) out.push(accum[i]);
                    a_count = 0;
                }
            }

            var n_bits;
            function output(code) {
                cur_accum &= masks[cur_bits];
                if (cur_bits > 0) cur_accum |= code << cur_bits;
                else cur_accum = code;
                cur_bits += n_bits;
                while (cur_bits >= 8) {
                    char_out(cur_accum & 0xff);
                    cur_accum >>= 8;
                    cur_bits -= 8;
                }
                if (free_ent > maxcode || clear_flg) {
                    if (clear_flg) {
                        n_bits = g_init_bits;
                        maxcode = (1 << n_bits) - 1;
                        clear_flg = false;
                    } else {
                        ++n_bits;
                        if (n_bits == BITS) maxcode = 1 << BITS;
                        else maxcode = (1 << n_bits) - 1;
                    }
                }
                if (code == EOFCode) {
                    while (cur_bits > 0) {
                        char_out(cur_accum & 0xff);
                        cur_accum >>= 8;
                        cur_bits -= 8;
                    }
                    flush_char();
                }
            }

            function nextPixel() {
                if (remaining === 0) return EOF;
                --remaining;
                return pixels[curPixel++] & 0xff;
            }

            this.encode = function() {
                out = [];
                cur_accum = 0;
                cur_bits = 0;
                remaining = width * height;
                curPixel = 0;
                compress(initCodeSize + 1);
                return out;
            };
        }

        return LZWEncoder;
    })();

    function GIFEncoder(width, height) {
        var out = [];
        var image, pixels, indexedPixels, colorDepth, colorTab, usedEntry = [];
        var palSize = 7;
        var dispose = -1;
        var firstFrame = true;
        var sample = 10;
        var delay = 0;
        var repeat = 0;
        var transIndex = 0;
        var transparent = null;

        this.setDelay = function(ms) { delay = Math.round(ms / 10); };
        this.setFrameRate = function(fps) { delay = Math.round(100 / fps); };
        this.setDispose = function(code) { if (code >= 0) dispose = code; };
        this.setRepeat = function(iter) { repeat = iter; };
        this.setTransparent = function(c) { transparent = c; };
        this.setQuality = function(q) { if (q < 1) q = 1; sample = q; };

        this.addFrame = function(imageData) {
            image = imageData;
            getImagePixels();
            analyzePixels();
            if (firstFrame) {
                writeLSD();
                writePalette();
                if (repeat >= 0) writeNetscapeExt();
            }
            writeGraphicCtrlExt();
            writeImageDesc();
            if (!firstFrame) writePalette();
            writePixels();
            firstFrame = false;
        };

        this.finish = function() {
            out.push(0x3b);
        };

        this.getOutput = function() {
            return new Uint8Array(out);
        };

        function analyzePixels() {
            var len = pixels.length;
            var nPix = len / 3;
            indexedPixels = new Uint8Array(nPix);
            var nq = new NeuQuant(pixels, sample);
            nq.buildColormap();
            colorTab = nq.getColormap();
            var k = 0;
            for (var j = 0; j < nPix; j++) {
                var index = nq.lookupRGB(pixels[k++] & 0xff, pixels[k++] & 0xff, pixels[k++] & 0xff);
                usedEntry[index] = true;
                indexedPixels[j] = index;
            }
            pixels = null;
            colorDepth = 8;
            palSize = 7;
            if (transparent !== null) {
                transIndex = findClosest(transparent);
            }
        }

        function findClosest(c) {
            if (colorTab === null) return -1;
            var r = (c & 0xFF0000) >> 16;
            var g = (c & 0x00FF00) >> 8;
            var b = c & 0x0000FF;
            var minpos = 0;
            var dmin = 256 * 256 * 256;
            var len = colorTab.length;
            for (var i = 0; i < len;) {
                var dr = r - (colorTab[i++] & 0xff);
                var dg = g - (colorTab[i++] & 0xff);
                var db = b - (colorTab[i] & 0xff);
                var d = dr * dr + dg * dg + db * db;
                var index = i / 3;
                if (usedEntry[index] && d < dmin) {
                    dmin = d;
                    minpos = index;
                }
                i++;
            }
            return minpos;
        }

        function getImagePixels() {
            var w = image.width;
            var h = image.height;
            pixels = new Uint8Array(w * h * 3);
            var data = image.data;
            var count = 0;
            for (var i = 0; i < h; i++) {
                for (var j = 0; j < w; j++) {
                    var b = (i * w * 4) + j * 4;
                    pixels[count++] = data[b];
                    pixels[count++] = data[b + 1];
                    pixels[count++] = data[b + 2];
                }
            }
        }

        function writeGraphicCtrlExt() {
            out.push(0x21);
            out.push(0xf9);
            out.push(4);
            var transp, disp;
            if (transparent === null) {
                transp = 0;
                disp = 0;
            } else {
                transp = 1;
                disp = 2;
            }
            if (dispose >= 0) disp = dispose & 7;
            disp <<= 2;
            out.push(0 | disp | 0 | transp);
            out.push(delay & 0xff);
            out.push((delay >> 8) & 0xff);
            out.push(transIndex);
            out.push(0);
        }

        function writeImageDesc() {
            out.push(0x2c);
            out.push(0); out.push(0);
            out.push(0); out.push(0);
            out.push(image.width & 0xff);
            out.push((image.width >> 8) & 0xff);
            out.push(image.height & 0xff);
            out.push((image.height >> 8) & 0xff);
            if (firstFrame) out.push(0);
            else out.push(0x80 | palSize);
        }

        function writeLSD() {
            out.push(image.width & 0xff);
            out.push((image.width >> 8) & 0xff);
            out.push(image.height & 0xff);
            out.push((image.height >> 8) & 0xff);
            out.push(0x80 | 0x70 | 0x00 | palSize);
            out.push(0);
            out.push(0);
        }

        function writeNetscapeExt() {
            out.push(0x21);
            out.push(0xff);
            out.push(11);
            var app = "NETSCAPE2.0";
            for (var i = 0; i < 11; i++) out.push(app.charCodeAt(i));
            out.push(3);
            out.push(1);
            out.push(repeat & 0xff);
            out.push((repeat >> 8) & 0xff);
            out.push(0);
        }

        function writePalette() {
            for (var i = 0; i < colorTab.length; i++) out.push(colorTab[i]);
            var n = 3 * 256 - colorTab.length;
            for (var j = 0; j < n; j++) out.push(0);
        }

        function writePixels() {
            var enc = new LZWEncoder(image.width, image.height, indexedPixels, colorDepth);
            var encoded = enc.encode();
            out.push(colorDepth);
            for (var i = 0; i < encoded.length; i++) out.push(encoded[i]);
            out.push(0);
        }

        out.push(0x47); out.push(0x49); out.push(0x46);
        out.push(0x38); out.push(0x39); out.push(0x61);
    }

    self.onmessage = function(ev) {
        var data = ev.data;
        var encoder = new GIFEncoder(data.width, data.height);
        encoder.setRepeat(data.repeat);
        encoder.setQuality(data.quality);
        if (data.transparent !== null) encoder.setTransparent(data.transparent);
        for (var i = 0; i < data.frames.length; i++) {
            var frame = data.frames[i];
            encoder.setDelay(frame.delay);
            encoder.addFrame(frame.data);
        }
        encoder.finish();
        var output = encoder.getOutput();
        self.postMessage({ type: 'finished', data: output.buffer }, [output.buffer]);
    };
})();
`], { type: 'application/javascript' });

const workerUrl = URL.createObjectURL(workerBlob);

export function SpriteSheetConverter({ spriteSheetUrl, onSave }: SpriteSheetConverterProps) {
    // Settings
    const [rows, setRows] = useState(1);
    const [cols, setCols] = useState(1);
    const [delay, setDelay] = useState(100);
    const [offsetTop, setOffsetTop] = useState(0);
    const [offsetBottom, setOffsetBottom] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [offsetRight, setOffsetRight] = useState(0);

    // Playback State
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]); // Empty = all selected
    const [startFrame, setStartFrame] = useState(1);
    const [endFrame, setEndFrame] = useState(1); // Will be updated when grid changes
    const [direction, setDirection] = useState<'forward' | 'reverse' | 'pingpong'>('forward');
    const [pingPongForward, setPingPongForward] = useState(true); // Internal state for pingpong

    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState<'top' | 'bottom' | 'left' | 'right' | null>(null);
    const [hoveredEdge, setHoveredEdge] = useState<'top' | 'bottom' | 'left' | 'right' | null>(null);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationRef = useRef<number | undefined>(undefined);

    // Load Image & Auto Detect
    useEffect(() => {
        setImageLoaded(false);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = spriteSheetUrl;
        img.onload = () => {
            imageRef.current = img;
            autoDetectGrid(img);
            setImageLoaded(true);
        };
        img.onerror = (err) => {
            console.error("Failed to load image:", err);
            // Try loading without CORS as fallback (might fail canvas export but allows viewing) - or just alert
            alert("Failed to load image. It might be due to CORS restrictions or an invalid URL.");
        };
    }, [spriteSheetUrl]);

    // Auto Detect Grid Logic
    const autoDetectGrid = (img: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Helper to check if a pixel is empty (alpha < 10)
        const isEmpty = (x: number, y: number) => {
            const index = (y * canvas.width + x) * 4;
            return data[index + 3] < 10;
        };

        // Scan for content bounds
        let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
        let hasContent = false;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                if (!isEmpty(x, y)) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                    hasContent = true;
                }
            }
        }

        if (!hasContent) return;

        // Detect Rows (gaps in Y)
        let detectedRows = 0;
        let inRow = false;
        for (let y = minY; y <= maxY; y++) {
            let rowHasContent = false;
            for (let x = minX; x <= maxX; x++) {
                if (!isEmpty(x, y)) {
                    rowHasContent = true;
                    break;
                }
            }
            if (rowHasContent && !inRow) {
                detectedRows++;
                inRow = true;
            } else if (!rowHasContent && inRow) {
                inRow = false;
            }
        }

        // Detect Cols (gaps in X) - Simplified: Check first row
        let detectedCols = 0;
        let inCol = false;
        // Sample the middle of the content height to avoid noise
        const sampleY = Math.floor((minY + maxY) / 2);

        // Better approach: Scan X across the entire height to find vertical gaps
        for (let x = minX; x <= maxX; x++) {
            let colHasContent = false;
            for (let y = minY; y <= maxY; y++) {
                if (!isEmpty(x, y)) {
                    colHasContent = true;
                    break;
                }
            }

            if (colHasContent && !inCol) {
                detectedCols++;
                inCol = true;
            } else if (!colHasContent && inCol) {
                inCol = false;
            }
        }

        // Fallbacks
        const r = Math.max(1, detectedRows);
        const c = Math.max(1, detectedCols);
        setRows(r);
        setCols(c);
        setSelectedRows([]); // Reset to all selected on new detection
        setStartFrame(1);
        setEndFrame(r * c);

        // Set offsets based on content bounds
        // setOffsetTop(minY);
        // setOffsetBottom(canvas.height - maxY - 1);
        // setOffsetLeft(minX);
        // setOffsetRight(canvas.width - maxX - 1);

        // For now, keep offsets 0 as sprites are often packed tightly or user might want to adjust manually
        // But setting rows/cols is the biggest help.
    };

    // Draw Grid Overlay
    const drawGrid = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw Image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Calculate Frame Size (ensure integers)
        const frameWidth = Math.floor((img.width - offsetLeft - offsetRight) / cols);
        const frameHeight = Math.floor((img.height - offsetTop - offsetBottom) / rows);

        // Draw Grid - Subtle but visible
        // 1. Dark outline for contrast
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
            const y = offsetTop + r * frameHeight;
            ctx.moveTo(offsetLeft, y);
            ctx.lineTo(img.width - offsetRight, y);
        }
        for (let c = 0; c <= cols; c++) {
            const x = offsetLeft + c * frameWidth;
            ctx.moveTo(x, offsetTop);
            ctx.lineTo(x, img.height - offsetBottom);
        }
        ctx.stroke();

        // 2. Light inner line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
            const y = offsetTop + r * frameHeight;
            ctx.moveTo(offsetLeft, y);
            ctx.lineTo(img.width - offsetRight, y);
        }
        for (let c = 0; c <= cols; c++) {
            const x = offsetLeft + c * frameWidth;
            ctx.moveTo(x, offsetTop);
            ctx.lineTo(x, img.height - offsetBottom);
        }
        ctx.stroke();

        // Draw Mask for Offsets (semi-transparent overlay on ignored areas)
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        // Top
        if (offsetTop > 0) ctx.fillRect(0, 0, canvas.width, offsetTop);
        // Bottom
        if (offsetBottom > 0) ctx.fillRect(0, canvas.height - offsetBottom, canvas.width, offsetBottom);
        // Left
        if (offsetLeft > 0) ctx.fillRect(0, offsetTop, offsetLeft, canvas.height - offsetTop - offsetBottom);
        // Right
        if (offsetRight > 0) ctx.fillRect(canvas.width - offsetRight, offsetTop, offsetRight, canvas.height - offsetTop - offsetBottom);

        // Draw draggable offset boundaries
        const hitZone = 10; // pixels on each side of the line

        // Top boundary
        if (offsetTop > 0 || hoveredEdge === 'top' || dragType === 'top') {
            ctx.strokeStyle = (hoveredEdge === 'top' || dragType === 'top') ? "rgba(59, 130, 246, 0.9)" : "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = (hoveredEdge === 'top' || dragType === 'top') ? 3 : 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, offsetTop);
            ctx.lineTo(canvas.width, offsetTop);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Bottom boundary
        if (offsetBottom > 0 || hoveredEdge === 'bottom' || dragType === 'bottom') {
            ctx.strokeStyle = (hoveredEdge === 'bottom' || dragType === 'bottom') ? "rgba(59, 130, 246, 0.9)" : "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = (hoveredEdge === 'bottom' || dragType === 'bottom') ? 3 : 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - offsetBottom);
            ctx.lineTo(canvas.width, canvas.height - offsetBottom);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Left boundary
        if (offsetLeft > 0 || hoveredEdge === 'left' || dragType === 'left') {
            ctx.strokeStyle = (hoveredEdge === 'left' || dragType === 'left') ? "rgba(59, 130, 246, 0.9)" : "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = (hoveredEdge === 'left' || dragType === 'left') ? 3 : 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(offsetLeft, 0);
            ctx.lineTo(offsetLeft, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Right boundary
        if (offsetRight > 0 || hoveredEdge === 'right' || dragType === 'right') {
            ctx.strokeStyle = (hoveredEdge === 'right' || dragType === 'right') ? "rgba(59, 130, 246, 0.9)" : "rgba(255, 255, 255, 0.8)";
            ctx.lineWidth = (hoveredEdge === 'right' || dragType === 'right') ? 3 : 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(canvas.width - offsetRight, 0);
            ctx.lineTo(canvas.width - offsetRight, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    };

    // Update Grid when settings change
    useEffect(() => {
        if (imageLoaded) {
            drawGrid();
        }
    }, [rows, cols, offsetTop, offsetBottom, offsetLeft, offsetRight, imageLoaded, hoveredEdge, dragType]);

    // Animation Loop
    useEffect(() => {
        if (!isPlaying || !imageRef.current) return;

        let lastTime = 0;
        const animate = (time: number) => {
            if (time - lastTime >= delay) {
                setCurrentFrame((prev) => {
                    // Get frames for selected rows only
                    const activeRows = selectedRows.length > 0 ? selectedRows : [...Array(rows)].map((_, i) => i);
                    const totalFrames = activeRows.length * cols;

                    // Effective range constrained by total available frames
                    const effectiveStart = Math.max(0, startFrame - 1);
                    const effectiveEnd = Math.min(totalFrames - 1, endFrame - 1);

                    // If range is invalid (start > end), just use start
                    if (effectiveStart > effectiveEnd) return effectiveStart;

                    let nextFrame;

                    if (direction === 'forward') {
                        nextFrame = prev + 1;
                        if (nextFrame > effectiveEnd || nextFrame < effectiveStart) {
                            nextFrame = effectiveStart;
                        }
                    } else if (direction === 'reverse') {
                        nextFrame = prev - 1;
                        if (nextFrame < effectiveStart || nextFrame > effectiveEnd) {
                            nextFrame = effectiveEnd;
                        }
                    } else {
                        // Ping Pong
                        if (pingPongForward) {
                            nextFrame = prev + 1;
                            if (nextFrame >= effectiveEnd) {
                                nextFrame = effectiveEnd;
                                setPingPongForward(false);
                            }
                        } else {
                            nextFrame = prev - 1;
                            if (nextFrame <= effectiveStart) {
                                nextFrame = effectiveStart;
                                setPingPongForward(true);
                            }
                        }
                    }

                    return nextFrame;
                });
                lastTime = time;
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, rows, cols, delay, selectedRows, startFrame, endFrame, direction, pingPongForward]);

    // Render Preview Frame
    useEffect(() => {
        const canvas = previewCanvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Ensure frame dimensions are integers
        const frameWidth = Math.floor((img.width - offsetLeft - offsetRight) / cols);
        const frameHeight = Math.floor((img.height - offsetTop - offsetBottom) / rows);

        canvas.width = frameWidth;
        canvas.height = frameHeight;

        // Map current frame index to actual row/col considering selected rows
        const activeRows = selectedRows.length > 0 ? selectedRows : [...Array(rows)].map((_, i) => i);
        const frameInActiveGrid = currentFrame % (activeRows.length * cols);
        const activeRowIndex = Math.floor(frameInActiveGrid / cols);
        const row = activeRows[activeRowIndex];
        const col = frameInActiveGrid % cols;
        const sx = Math.floor(offsetLeft + col * frameWidth);
        const sy = Math.floor(offsetTop + row * frameHeight);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
    }, [currentFrame, rows, cols, offsetTop, offsetBottom, offsetLeft, offsetRight, selectedRows]);

    // Global mouseup handler for dragging
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setDragType(null);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging]);

    // Mouse event handlers for draggable offsets
    const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const getEdgeAtPosition = (x: number, y: number): 'top' | 'bottom' | 'left' | 'right' | null => {
        const img = imageRef.current;
        if (!img) return null;

        const hitZone = 10;

        // Check top edge
        if (Math.abs(y - offsetTop) < hitZone) return 'top';
        // Check bottom edge
        if (Math.abs(y - (img.height - offsetBottom)) < hitZone) return 'bottom';
        // Check left edge
        if (Math.abs(x - offsetLeft) < hitZone) return 'left';
        // Check right edge
        if (Math.abs(x - (img.width - offsetRight)) < hitZone) return 'right';

        return null;
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasMousePos(e);
        if (!pos) return;

        const img = imageRef.current;
        if (!img) return;

        if (isDragging && dragType) {
            // Update offset based on drag
            switch (dragType) {
                case 'top':
                    setOffsetTop(Math.max(0, Math.min(pos.y, img.height - offsetBottom - 10)));
                    break;
                case 'bottom':
                    setOffsetBottom(Math.max(0, Math.min(img.height - pos.y, img.height - offsetTop - 10)));
                    break;
                case 'left':
                    setOffsetLeft(Math.max(0, Math.min(pos.x, img.width - offsetRight - 10)));
                    break;
                case 'right':
                    setOffsetRight(Math.max(0, Math.min(img.width - pos.x, img.width - offsetLeft - 10)));
                    break;
            }
        } else {
            // Update hover state
            const edge = getEdgeAtPosition(pos.x, pos.y);
            setHoveredEdge(edge);

            // Update cursor
            const canvas = canvasRef.current;
            if (canvas) {
                if (edge === 'top' || edge === 'bottom') {
                    canvas.style.cursor = 'ns-resize';
                } else if (edge === 'left' || edge === 'right') {
                    canvas.style.cursor = 'ew-resize';
                } else {
                    canvas.style.cursor = 'default';
                }
            }
        }
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getCanvasMousePos(e);
        if (!pos) return;

        const edge = getEdgeAtPosition(pos.x, pos.y);
        if (edge) {
            setIsDragging(true);
            setDragType(edge);
        }
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
        setDragType(null);
    };

    const handleCanvasMouseLeave = () => {
        if (!isDragging) {
            setHoveredEdge(null);
            const canvas = canvasRef.current;
            if (canvas) canvas.style.cursor = 'default';
        }
    };

    // Export selected rows as a PNG spritesheet
    const handleExportSpritesheet = () => {
        const img = imageRef.current;
        if (!img) return;

        const frameWidth = Math.floor((img.width - offsetLeft - offsetRight) / cols);
        const frameHeight = Math.floor((img.height - offsetTop - offsetBottom) / rows);
        const activeRows = selectedRows.length > 0 ? selectedRows : [...Array(rows)].map((_, i) => i);

        // Create canvas for the cropped spritesheet
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = frameWidth * cols;
        exportCanvas.height = frameHeight * activeRows.length;
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) return;

        // Draw each selected row
        activeRows.forEach((rowIndex, yOffset) => {
            const sy = offsetTop + rowIndex * frameHeight;
            ctx.drawImage(
                img,
                offsetLeft, sy, frameWidth * cols, frameHeight,
                0, yOffset * frameHeight, frameWidth * cols, frameHeight
            );
        });

        // Download
        exportCanvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `spritesheet-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    const handleSave = async () => {
        const img = imageRef.current;
        if (!img) return;

        setIsExporting(true);

        try {
            // Ensure frame dimensions are integers
            const frameWidth = Math.floor((img.width - offsetLeft - offsetRight) / cols);
            const frameHeight = Math.floor((img.height - offsetTop - offsetBottom) / rows);

            console.log('Starting GIF export...', { frameWidth, frameHeight, rows, cols, totalFrames: rows * cols });

            // Prepare frames data
            const frameList: { data: ImageData, delay: number }[] = [];
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = frameWidth;
            tempCanvas.height = frameHeight;
            const ctx = tempCanvas.getContext("2d", { willReadFrequently: true });

            if (!ctx) {
                throw new Error('Failed to get canvas context');
            }

            const activeRows = selectedRows.length > 0 ? selectedRows : [...Array(rows)].map((_, i) => i);
            const totalFrames = activeRows.length * cols;

            // Effective range
            const effectiveStart = Math.max(0, startFrame - 1);
            const effectiveEnd = Math.min(totalFrames - 1, endFrame - 1);

            // Generate sequence of indices based on direction
            const indices: number[] = [];

            if (direction === 'forward') {
                for (let i = effectiveStart; i <= effectiveEnd; i++) indices.push(i);
            } else if (direction === 'reverse') {
                for (let i = effectiveEnd; i >= effectiveStart; i--) indices.push(i);
            } else {
                // Ping Pong: Start -> End -> Start-1 (so it loops nicely)
                for (let i = effectiveStart; i <= effectiveEnd; i++) indices.push(i);
                for (let i = effectiveEnd - 1; i > effectiveStart; i--) indices.push(i);
            }

            indices.forEach(globalIndex => {
                // Map global index back to row/col
                const activeRowIndex = Math.floor(globalIndex / cols);
                const row = activeRows[activeRowIndex];
                const col = globalIndex % cols;

                const sx = offsetLeft + col * frameWidth;
                const sy = offsetTop + row * frameHeight;

                ctx.clearRect(0, 0, frameWidth, frameHeight);
                ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
                frameList.push({
                    data: ctx.getImageData(0, 0, frameWidth, frameHeight),
                    delay: delay
                });
            });

            // Send data to worker
            worker.postMessage({
                width: frameWidth,
                height: frameHeight,
                frames: frameList,
                repeat: 0,
                quality: 10,
                transparent: null
            });

            // Only include frames from selected rows


            console.log('All frames prepared, encoding with worker...');



        } catch (error) {
            console.error('Failed to start GIF rendering:', error);
            setIsExporting(false);
            alert('Failed to start GIF rendering: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Center: Canvas Viewer */}
            <div className="flex-1 bg-surface/10 p-4 sm:p-8 flex items-center justify-center overflow-auto relative min-h-[300px] lg:min-h-0">
                <div className="bg-surface-highlight border border-primary/10 rounded-lg shadow-2xl overflow-hidden max-w-full">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-auto max-h-[50vh] lg:max-h-[80vh] object-contain image-pixelated"
                        style={{ imageRendering: "pixelated" }}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseLeave}
                    />
                </div>

                {/* Floating Preview */}
                <div className="absolute top-4 sm:top-8 right-4 sm:right-8 bg-surface/90 backdrop-blur-md border border-primary/20 p-3 sm:p-4 rounded-xl shadow-xl flex flex-col items-center gap-2 sm:gap-3">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Preview</h3>
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface-highlight rounded-lg border border-primary/10 flex items-center justify-center overflow-hidden">
                        <canvas
                            ref={previewCanvasRef}
                            className="max-w-full max-h-full object-contain image-pixelated"
                            style={{ imageRendering: "pixelated" }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </Button>
                        <span className="text-[10px] sm:text-xs font-mono text-text-muted">
                            {currentFrame + 1} / {rows * cols}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Settings Panel */}
            <div className="w-full lg:w-80 bg-surface/30 border-t lg:border-t-0 lg:border-l border-primary/10 flex flex-col h-auto lg:h-full max-h-[50vh] lg:max-h-none">
                <div className="p-4 sm:p-6 border-b border-primary/10 flex items-center justify-between flex-shrink-0">
                    <h2 className="text-xs sm:text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Configuration</span>
                        <span className="sm:hidden">Config</span>
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 sm:h-7 text-[10px] sm:text-xs gap-1 sm:gap-1.5 px-2 sm:px-3"
                        onClick={() => imageRef.current && autoDetectGrid(imageRef.current)}
                    >
                        <Wand2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Auto
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar">
                    {/* Grid Settings */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-[11px] sm:text-xs font-medium text-text flex items-center gap-2">
                            <Grid3X3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                            Grid Layout
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Rows</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={rows}
                                    onChange={(e) => setRows(Number(e.target.value))}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Columns</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={cols}
                                    onChange={(e) => setCols(Number(e.target.value))}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row Selection - only show if multiple rows */}
                    {rows > 1 && (
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] sm:text-xs font-medium text-text flex items-center gap-2">
                                    <Rows3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                                    Row Selection
                                </h3>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 text-[9px] px-1.5"
                                        onClick={() => setSelectedRows([])}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 text-[9px] px-1.5"
                                        onClick={() => setSelectedRows([0])}
                                    >
                                        First
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(rows)].map((_, rowIndex) => {
                                    const isSelected = selectedRows.length === 0 || selectedRows.includes(rowIndex);
                                    return (
                                        <button
                                            key={rowIndex}
                                            onClick={() => {
                                                if (selectedRows.length === 0) {
                                                    // First click: select only this row
                                                    setSelectedRows([rowIndex]);
                                                } else if (selectedRows.includes(rowIndex)) {
                                                    // Deselect (unless it's the last one)
                                                    if (selectedRows.length > 1) {
                                                        setSelectedRows(prev => prev.filter(r => r !== rowIndex));
                                                    } else {
                                                        // If last one, reset to all
                                                        setSelectedRows([]);
                                                    }
                                                } else {
                                                    // Add to selection
                                                    setSelectedRows(prev => [...prev, rowIndex].sort((a, b) => a - b));
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all ${isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-surface-highlight text-text-muted hover:bg-surface-highlight/80'
                                                }`}
                                        >
                                            Row {rowIndex + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-text-muted">
                                {selectedRows.length === 0
                                    ? 'All rows will be animated and exported'
                                    : `${selectedRows.length} row${selectedRows.length > 1 ? 's' : ''} selected`
                                }
                            </p>
                        </div>
                    )}

                    {/* Frame Selection & Direction */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-[11px] sm:text-xs font-medium text-text flex items-center gap-2">
                            <Move className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                            Animation Settings
                        </h3>

                        {/* Frame Range */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Start Frame</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={endFrame}
                                    value={startFrame}
                                    onChange={(e) => {
                                        const val = Math.max(1, Math.min(Number(e.target.value), endFrame));
                                        setStartFrame(val);
                                    }}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">End Frame</Label>
                                <Input
                                    type="number"
                                    min={startFrame}
                                    max={rows * cols}
                                    value={endFrame}
                                    onChange={(e) => {
                                        const val = Math.max(startFrame, Math.min(Number(e.target.value), rows * cols));
                                        setEndFrame(val);
                                    }}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Direction */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-[10px] sm:text-xs text-text-muted">Direction</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'forward', label: 'Forward' },
                                    { value: 'reverse', label: 'Reverse' },
                                    { value: 'pingpong', label: 'Ping-Pong' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setDirection(opt.value as any)}
                                        className={`px-1 py-1.5 rounded-md text-[10px] font-medium transition-all ${direction === opt.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-surface-highlight text-text-muted hover:bg-surface-highlight/80'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-[11px] sm:text-xs font-medium text-text flex items-center gap-2">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                            Timing
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Frame Delay (ms)</Label>
                                <span className="text-[10px] sm:text-xs font-mono text-primary">{delay}ms</span>
                            </div>
                            <input
                                type="range"
                                min={20}
                                max={500}
                                step={10}
                                value={delay}
                                onChange={(e) => setDelay(Number(e.target.value))}
                                className="w-full accent-primary h-1.5 bg-surface-highlight rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Offsets */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-[11px] sm:text-xs font-medium text-text flex items-center gap-2">
                            <Move className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                            Offsets (px)
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Top</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetTop}
                                    onChange={(e) => setOffsetTop(Number(e.target.value))}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Bottom</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetBottom}
                                    onChange={(e) => setOffsetBottom(Number(e.target.value))}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Left</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetLeft}
                                    onChange={(e) => setOffsetLeft(Number(e.target.value))}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-[10px] sm:text-xs text-text-muted">Right</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetRight}
                                    onChange={(e) => setOffsetRight(Number(e.target.value))}
                                    className="h-8 text-xs sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 border-t border-primary/10 bg-surface/50 flex-shrink-0 space-y-2">
                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            size="lg"
                            onClick={handleSave}
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                                    <span className="text-xs sm:text-sm">Rendering...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                                    <span className="text-xs sm:text-sm">Export GIF</span>
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleExportSpritesheet}
                            disabled={isExporting}
                            title="Export as PNG spritesheet"
                        >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-text-muted text-center">
                        {selectedRows.length > 0 && selectedRows.length < rows
                            ? `Only ${selectedRows.length} selected row${selectedRows.length > 1 ? 's' : ''} will be exported`
                            : 'All rows will be exported'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}