import React, { useRef, useEffect, useState } from 'react';
import mapImage from '../../assets/map/catanUniverse.jpg'; // 이미지 경로

// 핀 좌표 목록 (label은 공백 처리)
const cornerPin = [
  [340, 135], [455, 135], [575, 135],
  [280, 165], [398, 165], [515, 165], [625, 165],
  [280, 230], [398, 230], [515, 230], [625, 230],
  [228, 260], [340, 260], [455, 260], [575, 260], [685, 260],
  [228, 335], [340, 335], [455, 335], [575, 335], [685, 335],
  [170, 360], [280, 360], [398, 360], [515, 360], [625, 360], [740, 360],
  [170, 430], [280, 430], [398, 430], [515, 430], [625, 430], [740, 430],
  [228, 460], [340, 460], [455, 460], [575, 460], [685, 460],
  [228, 525], [340, 525], [455, 525], [575, 525], [685, 525],
  [280, 560], [398, 560], [515, 560], [625, 560],
  [280, 625], [398, 625], [515, 625], [625, 625],
  [340, 660], [455, 660], [575, 660],
].map(([x, y], index) => ({ id: index + 1, x, y, label: '' }));

const edgePin = [
  [340, 135], [455, 135], [575, 135], 
  [280, 165], [398, 165], [515, 165], [625, 165],
  [280, 230], [398, 230], [515, 230], [625, 230],
  [228, 260], [340, 260], [455, 260], [575, 260], [685, 260],
  [228, 335], [340, 335], [455, 335], [575, 335], [685, 335],
  [170, 360], [280, 360], [398, 360], [515, 360], [625, 360], [740, 360],
  [170, 430], [280, 430], [398, 430], [515, 430], [625, 430], [740, 430],
  [228, 460], [340, 460], [455, 460], [575, 460], [685, 460],
  [228, 525], [340, 525], [455, 525], [575, 525], [685, 525],
  [280, 560], [398, 560], [515, 560], [625, 560],
  [280, 625], [398, 625], [515, 625], [625, 625],
  [340, 660], [455, 660], [575, 660],
].map(([x, y], index) => ({ id: index + 1, x, y, label: '' }));

const tilePin = [
  [340, 135], [455, 135], [575, 135],
  [280, 165], [398, 165], [515, 165], [625, 165],
  [280, 230], [398, 230], [515, 230], [625, 230], [685, 260],
  [228, 260], [340, 260], [455, 260], [575, 260],
  [228, 335], [340, 335], [455, 335]
].map(([x, y], index) => ({ id: index + 1, x, y, label: '' }));

function GameBoard() {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = mapImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setCanvasSize({ width: img.width, height: img.height });
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: canvasSize.width,
        height: canvasSize.height,
      }}
    >
      <canvas ref={canvasRef} />

      {cornerPin.map((pin) => (
        <button
          key={pin.id}
          style={{
            position: 'absolute',
            top: pin.y,
            left: pin.x,
            transform: 'translate(-50%, -50%)',
            background: '#eee',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            border: '3px solid #555',
            cursor: 'pointer',
            opacity: '50%',
          }}
          onClick={() => alert(`핀 ${pin.id} 클릭됨!`)}
        >
          {pin.label}
        </button>
      ))}

      {edgePin.map((pin) => (
        <button
          key={pin.id}
          style={{
            position: 'absolute',
            top: pin.y,
            left: pin.x,
            transform: 'translate(-50%, -50%)',
            background: '#eee',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            border: '3px solid #555',
            cursor: 'pointer',
            opacity: '50%',
          }}
          onClick={() => alert(`핀 ${pin.id} 클릭됨!`)}
        >
          {pin.label}
        </button>
      ))}

      {tilePin.map((pin) => (
        <button
          key={pin.id}
          style={{
            position: 'absolute',
            top: pin.y,
            left: pin.x,
            transform: 'translate(-50%, -50%)',
            background: '#eee',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            border: '3px solid #555',
            cursor: 'pointer',
            opacity: '50%',
          }}
          onClick={() => alert(`핀 ${pin.id} 클릭됨!`)}
        >
          {pin.label}
        </button>
      ))}
      
    </div>
  );
}

export default GameBoard;
