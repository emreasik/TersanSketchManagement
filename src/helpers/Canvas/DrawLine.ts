import { DrawLineColors } from "./Models/DrawLineColors";
import { Point } from "./Models/Point";
import { Size } from "./Models/Size";
export const DrawLine = class DrawLine {
    isDrawMode: boolean;
    PreviousDrawPoint: Point;
    CurrentDrawPoint: Point;
    Colors: DrawLineColors;
    PointHistory: Point[];
    CircleFound: boolean;
    Canvas: HTMLCanvasElement;
    sensitiveDistance: Size;
    currentPointColor: string;

    constructor(canvas:HTMLCanvasElement) {
        this.Canvas = canvas;
        this.defaultConfig();

    }

    public reset() : boolean {
        this.defaultConfig();

        return true;

    }

    private defaultConfig() : void {
        this.isDrawMode = false;
        this.PreviousDrawPoint = new Point();
        this.CurrentDrawPoint = new Point();
        this.Colors = new DrawLineColors("red","#000000","#000000");
        this.sensitiveDistance = new Size(10,10);
        this.PointHistory = [];
        this.CircleFound = false;
        this.currentPointColor = "blue";
    }

    getHistory() : Point[] {
        return this.PointHistory;
    }

    getCircleFound() : boolean {
        return this.CircleFound;
    }

    getPreviousPoint() : Point {
        return this.PreviousDrawPoint;
    }
    getCurrentPoint() : Point {
        return this.CurrentDrawPoint;
    }
    public getDrawMode() : boolean {
        return this.isDrawMode;
    }
    getCanvas() : HTMLCanvasElement {
        return this.Canvas;
    }
    getCanvasContext() : CanvasRenderingContext2D {
        return this.Canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    setCircleFound(circleFound:boolean) : void {
        this.CircleFound = circleFound;
    }

    setSensitiveDistance(xAxis:number,yAxis:number) : void {
        this.sensitiveDistance.xAxis = xAxis;
        this.sensitiveDistance.yAxis = yAxis;
    }

    setCurrentPointToPreviousPoint() : void {
        this.PreviousDrawPoint.x = this.CurrentDrawPoint.x;
        this.PreviousDrawPoint.y = this.CurrentDrawPoint.y;
    }
    setCurrentPointCoordinates(x:number,y:number) : void {
        this.CurrentDrawPoint.x = x;
        this.CurrentDrawPoint.y = y;
    }
    setPreviousPointCoordinates(x:number,y:number) : void {
        this.PreviousDrawPoint.x = x;
        this.PreviousDrawPoint.y = y;
    }
    isNearToExistingCircle(point:Point,eventPoint:Point) : boolean {
        return Math.abs(point.x - eventPoint.x) < this.sensitiveDistance.xAxis && Math.abs(point.y - eventPoint.y) < this.sensitiveDistance.yAxis;
    }

    private preventDrawIfNearToExistingCircle(eventPoint:Point,pressedCtrl:Boolean) : void {
        this.getHistory().forEach((point) => {
            // ctrl pressed
            if  (this.isNearToExistingCircle(point,eventPoint) && pressedCtrl)
            {
                console.log("near to existing circle also pressed ctrl");
                this.setPreviousPointCoordinates(this.CurrentDrawPoint.x,this.CurrentDrawPoint.y);
                this.drawCirleAndFill({x:this.CurrentDrawPoint.x,y:this.CurrentDrawPoint.y},this.Colors.circleColor,this.Colors.borderColor,2);
                // this.drawLine.setCurrentPointToPreviousPoint();
                this.setCurrentPointCoordinates(point.x,point.y);
                this.drawCirleAndFill({x:this.CurrentDrawPoint.x,y:this.CurrentDrawPoint.y},this.currentPointColor,this.Colors.borderColor,2);
                this.setCircleFound(true);
                return;
            }
            else if(this.isNearToExistingCircle(point,eventPoint)) {
                console.log(point);
                console.log(eventPoint);
                this.PreviousDrawPoint.x = 0;
                this.PreviousDrawPoint.y = 0;
                this.drawCirleAndFill({x:this.CurrentDrawPoint.x,y:this.CurrentDrawPoint.y},this.Colors.circleColor,this.Colors.borderColor,2);
                this.setCurrentPointCoordinates(point.x,point.y);
                this.drawCirleAndFill({x:this.CurrentDrawPoint.x,y:this.CurrentDrawPoint.y},this.currentPointColor,this.Colors.borderColor,2);
                this.setCircleFound(true);
                return;
            }
        })

    }

    public setDrawLine(eventPoint:Point,pressedCtrl:boolean) : void {

        this.preventDrawIfNearToExistingCircle(eventPoint,pressedCtrl);

        if(this.CurrentDrawPoint != null && !this.CircleFound) {
            this.setPreviousPointCoordinates(this.CurrentDrawPoint.x,this.CurrentDrawPoint.y);
        }
        if(!this.CircleFound){
            this.setCurrentPointCoordinates(eventPoint.x,eventPoint.y);
        }
        if(!this.CircleFound){
            this.drawCirleAndFill({x:this.PreviousDrawPoint.x,y:this.PreviousDrawPoint.y},this.Colors.circleColor,this.Colors.borderColor,2);
            this.drawCirleAndFill({x:eventPoint.x,y:eventPoint.y},this.currentPointColor,this.Colors.borderColor,2);
            this.PointHistory.push({x: eventPoint.x, y: eventPoint.y});
        }
        if(this.PreviousDrawPoint != null && this.PreviousDrawPoint.x != 0 && this.PreviousDrawPoint.y != 0
            && this.CurrentDrawPoint != null && this.CurrentDrawPoint.x != 0 && this.CurrentDrawPoint.y != 0
            && (!this.CircleFound || pressedCtrl)
        )
        {
            this.drawLine({x:this.PreviousDrawPoint.x, y:this.PreviousDrawPoint.y}, {x:this.CurrentDrawPoint.x, y:this.CurrentDrawPoint.y}, this.Colors.lineColor, 3);
        }

        this.CircleFound = false;
    }
    private drawLine(startPoint:Point,endPoint:Point, color:string, width:number) : void {
        const ctx = this.getCanvasContext();
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
    }
    private drawCirleAndFill(point:Point, color:string,strokeColor:string,width:number) : void {
        
        const ctx = this.getCanvasContext();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = width;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }

    checkPointsExist() : boolean {
        return (this.PreviousDrawPoint != null && this.PreviousDrawPoint.x != 0 && this.PreviousDrawPoint.y != 0
            && this.CurrentDrawPoint != null && this.CurrentDrawPoint.x != 0 && this.CurrentDrawPoint.y != 0)
    }
}
    
