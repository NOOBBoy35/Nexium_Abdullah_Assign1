'use client';
import { useEffect, useRef } from "react";

const DOT_SPACING = 40; // px
const DOT_RADIUS = 3;
const LINE_COLOR = "rgba(255,255,255,0.18)";
const DOT_COLOR = "rgba(255,255,255,0.10)";
const SNAKE_SPEED = 2; // px per frame
const SNAKE_WIDTH = 8;
const TRAIL_FADE = 0.02; // how quickly the trail fades
const SNAKE_INTERVAL = 1800; // ms between new snakes

function getGrid(width: number, height: number) {
    const cols = Math.floor(width / DOT_SPACING);
    const rows = Math.floor(height / DOT_SPACING);
    const dots = [];
    for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
            dots.push({
                x: x * DOT_SPACING + DOT_SPACING / 2,
                y: y * DOT_SPACING + DOT_SPACING / 2,
            });
        }
    }
    return dots;
}

type Snake = {
    path: { x: number; y: number }[];
    progress: number;
    fade: number;
};

const AnimatedSnakeBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const snakesRef = useRef<Snake[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let dots = getGrid(width, height);

        function handleResize() {
            width = window.innerWidth;
            height = window.innerHeight;
            if (!canvas) return;
            canvas.width = width;
            canvas.height = height;
            dots = getGrid(width, height);
        }
        window.addEventListener("resize", handleResize);

        // Draw dots
        function drawDots() {
            if (!ctx) return;
            for (const dot of dots) {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, 2 * Math.PI);
                ctx.fillStyle = DOT_COLOR;
                ctx.fill();
            }
        }

        // Snake logic
        function spawnSnake() {
            // Only allow up to 6 snakes at a time
            if (snakesRef.current.length >= 6) return;
            // Start at a random edge dot
            const edgeDots = dots.filter(
                (d) => d.x < DOT_SPACING * 1.5 || d.x > width - DOT_SPACING * 1.5 || d.y < DOT_SPACING * 1.5 || d.y > height - DOT_SPACING * 1.5
            );
            const startIdx = Math.floor(Math.random() * edgeDots.length);
            const start = edgeDots[startIdx];
            let current = start;
            const visited = new Set<number>();
            const path = [current];
            const idx = dots.findIndex((d) => d.x === current.x && d.y === current.y);
            visited.add(idx);
            // Determine the starting edge
            let startingEdge: 'left' | 'right' | 'top' | 'bottom';
            if (start.x < DOT_SPACING * 1.5) startingEdge = 'left';
            else if (start.x > width - DOT_SPACING * 1.5) startingEdge = 'right';
            else if (start.y < DOT_SPACING * 1.5) startingEdge = 'top';
            else startingEdge = 'bottom';
            // Build a random walk path for a long distance
            for (let i = 0; i < 400; i++) {
                // Only allow straight (no diagonal) moves, and don't allow going back to the starting edge
                const neighbors = dots
                    .map((dot, i) => ({ dot, i }))
                    .filter(({ dot, i }) => {
                        if (visited.has(i)) return false;
                        const dx = dot.x - current.x;
                        const dy = dot.y - current.y;
                        // Only allow up, down, left, right (no diagonals)
                        const valid = (
                            (dx === DOT_SPACING && dy === 0) ||
                            (dx === -DOT_SPACING && dy === 0) ||
                            (dx === 0 && dy === DOT_SPACING) ||
                            (dx === 0 && dy === -DOT_SPACING)
                        );
                        if (!valid) return false;
                        // Prevent going back to the starting edge
                        if (startingEdge === 'left' && dot.x < DOT_SPACING * 1.5) return false;
                        if (startingEdge === 'right' && dot.x > width - DOT_SPACING * 1.5) return false;
                        if (startingEdge === 'top' && dot.y < DOT_SPACING * 1.5) return false;
                        if (startingEdge === 'bottom' && dot.y > height - DOT_SPACING * 1.5) return false;
                        return true;
                    });
                if (neighbors.length === 0) break;
                // Pick a random neighbor
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                current = next.dot;
                path.push(current);
                visited.add(next.i);
                // Stop if at edge (but not the starting edge)
                if (
                    (current.x < DOT_SPACING * 1.5 && startingEdge !== 'left') ||
                    (current.x > width - DOT_SPACING * 1.5 && startingEdge !== 'right') ||
                    (current.y < DOT_SPACING * 1.5 && startingEdge !== 'top') ||
                    (current.y > height - DOT_SPACING * 1.5 && startingEdge !== 'bottom')
                ) {
                    break;
                }
            }
            snakesRef.current.push({ path, progress: 0, fade: 1 });
        }

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            drawDots();
            // Animate snakes
            for (const snake of snakesRef.current) {
                ctx.save();
                ctx.globalAlpha = snake.fade;
                ctx.strokeStyle = LINE_COLOR;
                ctx.lineWidth = SNAKE_WIDTH;
                ctx.beginPath();
                let totalLen = 0;
                for (let i = 0; i < snake.path.length - 1; i++) {
                    const from = snake.path[i];
                    const to = snake.path[i + 1];
                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    const segLen = Math.sqrt(dx * dx + dy * dy);
                    if (snake.progress > totalLen + segLen) {
                        ctx.moveTo(from.x, from.y);
                        ctx.lineTo(to.x, to.y);
                    } else if (snake.progress > totalLen) {
                        const t = (snake.progress - totalLen) / segLen;
                        ctx.moveTo(from.x, from.y);
                        ctx.lineTo(from.x + dx * t, from.y + dy * t);
                        break;
                    }
                    totalLen += segLen;
                }
                ctx.stroke();
                ctx.restore();
                // Update progress
                let pathLen = 0;
                for (let i = 0; i < snake.path.length - 1; i++) {
                    const from = snake.path[i];
                    const to = snake.path[i + 1];
                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    pathLen += Math.sqrt(dx * dx + dy * dy);
                }
                if (snake.progress < pathLen) {
                    snake.progress += SNAKE_SPEED;
                } else {
                    snake.fade -= TRAIL_FADE;
                }
            }
            // Remove faded snakes
            snakesRef.current = snakesRef.current.filter((s) => s.fade > 0);
            // If any snakes finished, spawn new ones immediately to keep 6
            if (snakesRef.current.length < 6) {
                maintainSnakes();
            }
            animationRef.current = requestAnimationFrame(animate);
        }

        // Always keep 6 snakes on the screen
        function maintainSnakes() {
            while (snakesRef.current.length < 6) {
                spawnSnake();
            }
        }

        const snakeTimer = setInterval(maintainSnakes, SNAKE_INTERVAL);
        maintainSnakes();
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearInterval(snakeTimer);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
            style={{ display: "block" }}
            aria-hidden="true"
        />
    );
};

export default AnimatedSnakeBackground; 