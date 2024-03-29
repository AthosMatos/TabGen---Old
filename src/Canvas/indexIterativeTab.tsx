import React, { useRef, useEffect, useState } from "react";
import { CanvasProps } from "./interfaces";
import { PosI } from "../interfaces";

//dictionary of all possible notes from on a standard tuned guitar

//all possible notes from on a standard tuned guitar with 22 frets
const allNotesFromFrets = [
    /*e*/['E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6', 'C#6'],
    /*B*/['B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5'],
    /*G*/['G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5'],
    /*D*/['D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'],
    /*A*/['A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4'],
    /*E*/['E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4']
]

const allNotesUnique = [
    'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4',
    'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5',
    'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5',
    'A5', 'A#5', 'B5', 'C6', 'C#6'
]

// Define a 2D grid graph

const frets = 22
const strings = 6





/* // Mark some cells as blocked
const blockedNods = [7, 12, 17];
for (const blockedNod of blockedNods) {
    edges[blockedNod] = [];
}

// Find the shortest path using A* algorithm
const startNod = 0; // Index of the start Nod
const endNod = 24; // Index of the end Nod

const shortestPath = aStar({ Nods, edges }, startNod, endNod);

// Display the shortest path
if (shortestPath.length > 0) {
    console.log("Shortest path:");
    for (const Nod of shortestPath) {
        console.log(`Nod ${Nod} (${Nods[Nod].x}, ${Nods[Nod].y})`);
    }
} else {
    console.log("No path found.");
}
 */



const Canvas = (props: CanvasProps) => {

    const size = 26 + 1
    //const maxHousesFingerJump = 4 //max number of houses a finger can jump
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [squareSize, setSquareSize] = useState(window.innerWidth / 26)
    const mousePosRef = useRef({ x: 0, y: 0 })
    const noteAnalisisRef = useRef("G3")
    const pos = useRef({
        string: 4 - 1,
        fret: 10,
    })


    const updateWindowSize = () => {
        setSquareSize(window.innerWidth / size)
    };

    useEffect(() => {
        window.addEventListener("resize", updateWindowSize);
        return () => window.removeEventListener("resize", updateWindowSize);
    });


    function vasculhar() {

        // Conect all Nods with their neighbours, also diagonally
        const eachStringWeight: number[][] = [];
        let biggetWeight = 0
        let nextPosNote: PosI = { string: 0, fret: 0 }
        let nextNoteSmallestWeight = -1

        for (let str = 0; str < strings; str++) {
            const fretWeight: number[] = []
            for (let frt = 0; frt < frets; frt++) {
                //eachStringFill
                //const dist = Math.abs(Math.pow(Math.abs(str - Pos.fret), 2) + Math.abs(frt - Pos.string));
                //const dist = Math.abs(str - Pos.string) + Math.abs(frt - Pos.fret)
                let dist = (Math.abs(pos.current.string - str) + Math.abs(pos.current.fret - frt))
                //if (frt === 0) dist = Math.abs(str - pos.current.string) + Math.abs(frets - pos.current.fret)
                if (frt === 0) dist = 4


                fretWeight.push(dist)
                if (dist > biggetWeight) {
                    biggetWeight = dist
                }
                if (allNotesFromFrets[str][frt] === noteAnalisisRef.current) {
                    if (nextNoteSmallestWeight === -1) {
                        nextNoteSmallestWeight = dist
                        nextPosNote = { string: str, fret: frt }
                    }
                    else if (dist < nextNoteSmallestWeight) {
                        nextNoteSmallestWeight = dist
                        nextPosNote = { string: str, fret: frt }
                    }
                }
            }
            eachStringWeight.push(fretWeight)
        }
        return { eachStringWeight, biggetWeight, nextPosNote }
    }


    const draw = (ctx: CanvasRenderingContext2D) => {
        const fontSize = 10
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = 4;

        /* //print strings names
        ctx.font = "bold 25px Arial";
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.fillText("e", 0 * squareSize + squareSize / 2 - 10, 0 * squareSize + squareSize / 2 + 10);
        ctx.fillText("B", 0 * squareSize + squareSize / 2 - 10, 1 * squareSize + squareSize / 2 + 10);
        ctx.fillText("G", 0 * squareSize + squareSize / 2 - 10, 2 * squareSize + squareSize / 2 + 10);
        ctx.fillText("D", 0 * squareSize + squareSize / 2 - 10, 3 * squareSize + squareSize / 2 + 10);
        ctx.fillText("A", 0 * squareSize + squareSize / 2 - 10, 4 * squareSize + squareSize / 2 + 10);
        ctx.fillText("E", 0 * squareSize + squareSize / 2 - 10, 5 * squareSize + squareSize / 2 + 10); */

        ctx.font = `bold ${fontSize}px Arial`;

        const { eachStringWeight, biggetWeight, nextPosNote } = vasculhar()

        for (let st = 0; st < strings; st++) {
            for (let frt = 0; frt < frets; frt++) {
                const x = frt * squareSize + squareSize / 2
                const y = st * squareSize + squareSize / 2

                ctx.fillStyle = "black";
                //stroke color gets greener when eachStringWeight[st][frt] is smaller
                ctx.strokeStyle = `rgb(0, ${255 + ((eachStringWeight[st][frt] / biggetWeight) * -255)}, 0)`;

                if (nextPosNote.fret === frt && nextPosNote.string === st) {
                    //ctx.fillStyle = "pink";
                    ctx.strokeStyle = "blue";
                }
                if (st === pos.current.string && frt === pos.current.fret) {
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "red";
                }

                if (mousePosRef.current.x > x - squareSize / 2 && mousePosRef.current.x < x + squareSize / 2 && mousePosRef.current.y > y - squareSize / 2 && mousePosRef.current.y < y + squareSize / 2) {
                    pos.current = { string: st, fret: frt }
                }

                ctx.beginPath();
                ctx.arc(x, y, squareSize / 2 - 5, 0, 2 * Math.PI);
                ctx.stroke();
                //font bold

                // const fontWidth = ctx.measureText(allNotesFromFrets[st][frt]).width
                const fontWidth = ctx.measureText(allNotesFromFrets[st][frt]).width + ctx.measureText(eachStringWeight[st][frt].toString()).width + 5
                //ctx.fillText(allNotesFromFrets[st][frt], frt * squareSize + squareSize / 2 - (fontWidth / 2), st * squareSize + squareSize / 2 + fontSize / 2);
                ctx.fillText(`${(eachStringWeight[st][frt]).toString()} ${allNotesFromFrets[st][frt]}`, frt * squareSize + squareSize / 2 - (fontWidth / 2), st * squareSize + squareSize / 2 + fontSize / 2);
            }
        }

        requestAnimationFrame(() => draw(ctx));
    }


    useEffect(() => {
        if (!canvasRef) return
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        //draw(context);
        requestAnimationFrame(() => draw(context));
    }, [canvasRef]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <div style={{
                display: "flex",
                maxWidth: frets * squareSize,
                flexWrap: "wrap",
                gap: "0.5rem",
            }}>
                {allNotesUnique.map((note, index) => {
                    return <div key={index} style={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        width: '40px', height: '40px', borderRadius: '100rem', backgroundColor: 'red'
                    }}>
                        {note}
                    </div>
                })}
            </div>

            <canvas
                width={frets * squareSize}
                height={strings * squareSize}
                style={{
                    border: "6px solid black",
                    borderRadius: "1rem"
                }}
                onMouseMove={(e) => {
                    mousePosRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
                }}
                ref={canvasRef}
                {...props.canvasProps}
            />
        </div>
    );
};

export default Canvas;
