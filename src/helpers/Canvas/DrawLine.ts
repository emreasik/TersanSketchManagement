import { DrawLineColors } from "./Models/DrawLineColors";
import { Point } from "./Models/Point";
import { RectSize } from "./Models/RectSize";
import { Edge } from "./Models/Edge";
import { IdentityPoint } from "./Models/IdentityPoint";
import { Size } from "./Models/Size";
export const DrawLine = class DrawLine {
    isDrawMode: boolean;
    PreviousDrawPoint: Point;
    CurrentDrawPoint: Point;
    Colors: DrawLineColors;
    PointHistory: IdentityPoint[];
    CircleFound: boolean;
    Canvas: HTMLCanvasElement;
    sensitiveDistance: Size;
    currentPointColor: string;
    Edges: Edge[];
    id: number;


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
        this.PreviousDrawPoint = new Point(0,0);
        this.CurrentDrawPoint = new Point(0,0);
        this.Colors = new DrawLineColors("red","#000000","#000000");
        this.sensitiveDistance = new Size(10,10);
        this.PointHistory = [];
        this.CircleFound = false;
        this.currentPointColor = "blue";
        this.id = 1;
        this.Edges = [];
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
            this.PointHistory.push({id:this.id,x: eventPoint.x, y: eventPoint.y});
            this.id++;

        }
        if(this.PreviousDrawPoint != null && this.PreviousDrawPoint.x != 0 && this.PreviousDrawPoint.y != 0
            && this.CurrentDrawPoint != null && this.CurrentDrawPoint.x != 0 && this.CurrentDrawPoint.y != 0
            && (!this.CircleFound || pressedCtrl)
        )
        {
            this.drawLine({x:this.PreviousDrawPoint.x, y:this.PreviousDrawPoint.y}, {x:this.CurrentDrawPoint.x, y:this.CurrentDrawPoint.y}, this.Colors.lineColor, 3);
            this.Edges.push({from:new Point(this.PreviousDrawPoint.x,this.PreviousDrawPoint.y),to:{x:this.CurrentDrawPoint.x,y:this.CurrentDrawPoint.y}});
            
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
    calculateWidthAndHeightOfRectangle() : RectSize {
        let points = this.detectRectanglePoints();
        console.log(points);
        
        this.drawRectangle();
        let size:RectSize = new RectSize(0,0);
        if(points?.length === 4)
        {

            size.width = Math.abs(points[0].x - points[1].x);
            
            size.height = Math.abs(points[1].y - points[2].y);

        }

        return size;
        
    }

    getStartPointOfRectangle() : Point {
        let points = this.detectRectanglePoints();
        this.drawRectangle();
        let startPoint:Point = new Point(0,0);
        if(points?.length === 4)
        {
            startPoint.x = points[0].x;
            startPoint.y = points[0].y;
        }
    
        return startPoint;
    }

    pushImageToRectangleField(img:HTMLImageElement,beforeDraw:Function) : void {
       if(this.Edges.length === 4){
        let startPoint = this.getStartPointOfRectangle();
        let size = this.calculateWidthAndHeightOfRectangle();
        let ctx = this.getCanvasContext();
        beforeDraw();
        ctx.drawImage(img,startPoint.x,startPoint.y,size.width,size.height);
       }
    }

    hasEnoughPointsForRectangle() : boolean {
        return this.PointHistory.length === 4;
    }

    checkPointsExist() : boolean {
        return (this.PreviousDrawPoint != null && this.PreviousDrawPoint.x != 0 && this.PreviousDrawPoint.y != 0
            && this.CurrentDrawPoint != null && this.CurrentDrawPoint.x != 0 && this.CurrentDrawPoint.y != 0)
    }

    drawRectangle() : void {
            if(this.PointHistory.length === 4){
                let points = this.detectRectanglePoints();
                console.log(points);
                
            if(points.length === 4)
            {
                this.drawLine(points[0],points[1],this.Colors.lineColor,3);
                this.drawLine(points[1],points[2],this.Colors.lineColor,3);
                this.drawLine(points[2],points[3],this.Colors.lineColor,3);
                this.drawLine(points[3],points[0],this.Colors.lineColor,3);
            }

            }
    }

    detectRectanglePoints()  : any {
        let points:Point[] = [];
        if(this.PointHistory.length === 4)
        {
            let result = this.Edges.filter((edge) => edge.from.x === this.PointHistory[0].x && edge.from.y === this.PointHistory[0].y ||
                edge.to.x === this.PointHistory[0].x && edge.to.y === this.PointHistory[0].y)

            if(result.length === 2)
            {
                let smallest = {...this.PointHistory[0]};
                let biggest = {...this.PointHistory[0]};
                 //detect smallest x and y to find top left point
                this.PointHistory.forEach((point) => {
                    if(point.x < smallest.x)
                    {
                        smallest.x = point.x;
                    }
                    if(point.y < smallest.y)
                    {
                        smallest.y = point.y;
                    }
                    if(point.x > biggest.x)
                    {
                        biggest.x = point.x;
                    }
                    if(point.y > biggest.y)
                    {
                        biggest.y = point.y;
                    }
                })
                console.log(smallest);

                console.log(biggest);
                points = this.createRectanglePoints(smallest,biggest);
                }

                return points;

        }
    }

    private createRectanglePoints(topLeft:Point,bottomRight:Point) : Point[] {
        let points:Point[] = [];
        points.push({x:topLeft.x,y:topLeft.y});
        points.push({x:bottomRight.x,y:topLeft.y});
        points.push({x:bottomRight.x,y:bottomRight.y});
        points.push({x:topLeft.x,y:bottomRight.y});
        return points;
    }

}
    
