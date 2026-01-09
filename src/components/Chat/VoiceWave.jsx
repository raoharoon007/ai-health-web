import { useEffect, useState, useRef } from "react";

const VoiceWave = ({ active, color = "#1D1D1B" }) => {
    const [barCount, setBarCount] = useState(window.innerWidth < 640 ? 60 : 160);
    const [heights, setHeights] = useState(Array(barCount).fill(4));
    
    const animationRef = useRef();
    const audioContextRef = useRef();
    const streamRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            const newCount = window.innerWidth < 640 ? 60 : 160;
            setBarCount(newCount);
            setHeights(Array(newCount).fill(4));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const stopAudio = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => track.stop());
            streamRef.current = null; 
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setHeights(Array(barCount).fill(4));
    };

    const startAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);

            analyser.fftSize = 256; // Mobile performance ke liye thoda kam rakha hai
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);

            const animate = () => {
                if (!streamRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                
                const step = Math.floor(dataArray.length / barCount) || 1;
                const newHeights = [];

                for (let i = 0; i < barCount; i++) {
                    let val = dataArray[i * step];
                    let h = val > 5 ? (val / 255) * 35 + 4 : 4;
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
        if (active) {
            startAudio();
        } else {
            stopAudio();
        }
        return () => {
            isMounted = false;
            stopAudio(); 
        };
    }, [active, barCount]); // barCount change hone par restart logic

    return (
        <div 
            className="flex items-center justify-center gap-0.5 w-full h-12 overflow-hidden px-1"
            style={{ display: active ? 'flex' : 'none' }} 
        >
            {heights.map((h, i) => (
                <span
                    key={i}
                    className="rounded-full transition-all duration-75 ease-out shrink-0"
                    style={{
                        width: window.innerWidth < 640 ? "3px" : "2px", // Mobile par bars thode mote
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