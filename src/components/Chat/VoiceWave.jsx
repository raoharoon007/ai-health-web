import { useEffect, useState, useRef } from "react";

const VoiceWave = ({ active, color = "#1D1D1B" }) => {
    const [heights, setHeights] = useState(Array(160).fill(4));
    const animationRef = useRef();
    const audioContextRef = useRef();
    const streamRef = useRef();

    const stopAudio = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => {
                track.stop(); 
                track.enabled = false;
            });
            streamRef.current = null; 
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.log("Ctx close error:", e));
            audioContextRef.current = null;
        }

        setHeights(Array(160).fill(4));
    };

    // 2. Start Audio Function
    const startAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);

            analyser.fftSize = 512;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);

            const animate = () => {
                if (!streamRef.current) return; // Stop animation if stream is gone
                analyser.getByteFrequencyData(dataArray);
                const step = Math.floor(dataArray.length / 160) || 1;
                const newHeights = [];

                for (let i = 0; i < 160; i++) {
                    let val = dataArray[i * step];
                    let h = val > 5 ? (val / 255) * 40 + 4 : 4;
                    newHeights.push(h);
                }

                setHeights(newHeights);
                animationRef.current = requestAnimationFrame(animate);
            };

            animate();
        } catch (err) {
            console.error("Mic access denied:", err);
        }
    };

    useEffect(() => {
        let isMounted = true; 

        const initMic = async () => {
            if (active && isMounted) {
                await startAudio();
            }
        };

        if (active) {
            initMic();
        } else {
            stopAudio();
        }

        return () => {
            isMounted = false;
            stopAudio(); 
        };
    }, [active]);


    return (
        <div 
        className="flex items-center justify-between gap-px w-full h-12 overflow-hidden px-2"
        style={{ display: active ? 'flex' : 'none' }} 
    >
        {heights.map((h, i) => (
            <span
                key={i}
                className="rounded-full transition-all duration-75 ease-out"
                style={{
                    width: "2px",
                    height: `${h}px`,
                    backgroundColor: color,
                    opacity: h > 5 ? 0.9 : 0.2,
                }}
            />
        ))}
    </div>
    );
};

export default VoiceWave;