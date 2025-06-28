import React, {useRef, useEffect} from 'react';

function GameBoard() {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
            canvas.src = '../../assets/map/catanUniverse.jpg';
        }
    }, []);

    return (
        <canvas ref={canvasRef} width={901} height={793}/>
    );
}

export default GameBoard;