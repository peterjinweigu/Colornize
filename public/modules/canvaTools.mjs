export function drawPolygon(ctx, vertices, strokeWidth, strokeColour, fillColour) {
    ctx.beginPath();
    vertices.forEach((vertex, index) => {
        if (index == 0) ctx.moveTo(vertex.x, vertex.y);
        else ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColour;
    ctx.fillStyle = fillColour;
    ctx.stroke();
    ctx.fill();
}

export function drawRect(ctx, x, y, w, h, strokeWidth, strokeColour, fillColour) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColour;
    ctx.fillStyle = fillColour;
    ctx.stroke();
    ctx.fill();
}