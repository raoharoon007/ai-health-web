import { useEffect, useRef, useState } from "react";

const VoiceWave = ({ active, audioStream, color = "#1D1D1B" }) => {
    const [barCount, setBarCount] = useState(window.innerWidth < 640 ? 60 : 160);
    const [heights, setHeights] = useState(Array(barCount).fill(4));
    
    const animationRef = useRef();
    const audioContextRef = useRef();
    const analyserRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            const newCount = window.innerWidth < 640 ? 60 : 160;
            setBarCount(newCount);
            setHeights(Array(newCount).fill(4));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const stopVisualizer = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setHeights(Array(barCount).fill(4));
    };

    const startVisualizer = () => {
        if (!audioStream) return; 

        try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContextRef.current.createAnalyser();
            analyserRef.current = analyser;
            const source = audioContextRef.current.createMediaStreamSource(audioStream);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);

            const animate = () => {
                if (!active) return;
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
            console.error("Visualizer error:", err);
        }
    };

    useEffect(() => {
        if (active && audioStream) {
            startVisualizer();
        } else {
            stopVisualizer();
        }
        return () => stopVisualizer();
    }, [active, audioStream, barCount]);

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
                        width: window.innerWidth < 640 ? "3px" : "2px",
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