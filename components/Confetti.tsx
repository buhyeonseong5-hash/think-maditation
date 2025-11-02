
import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 150 }).map((_, i) => {
      const hue = Math.random() * 360;
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          backgroundColor: `hsl(${hue}, 100%, 70%)`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 1}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        },
      };
    });
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 20px;
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={p.style} />
      ))}
    </div>
  );
};

export default Confetti;
