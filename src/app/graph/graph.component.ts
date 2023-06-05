import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Simulation, SimulationNodeDatum, drag, forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, select, thresholdSturges, zoom } from 'd3';
import { CarpenterService } from '../carpenter.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, OnChanges {
  @Input() public vertices: Array<{
    id: string,
    content: {}
  }> = [];

  @Input() public edges: Array<{
    source: any,
    relation: string,
    target: any
  }> = [];

  private colors: { [key: string]: string } = {
    "DT": "#f44336",
    "EP": "#9c27b0",
    "IOGH": "#3f51b5",
    "OLAF": "#17ac48",
    "SMATCH": "#d4c600",
    "ETD": "#0084ff",
    "OE": "#ff9800",
  }

  @Input() public relations: string[] = [];
  @Input() public enableNodeColors: boolean = true;
  @Input() public enableEdgeColors: boolean = false;

  private simulation: Simulation<SimulationNodeDatum, undefined>;
  private node: any;
  private link: any;
  private circles: any;
  private labels: any;

  constructor(public carpenter: CarpenterService) {
    this.simulation = forceSimulation(this.vertices as any);

    this.carpenter.get_vertices().subscribe((vertices) => {
      this.vertices = vertices;
      this.simulation = forceSimulation(this.vertices as any);
      this.carpenter.get_edges().subscribe((edges) => {
        this.edges = edges.map((edge) => {
          let source = this.vertices.find((v) => v.id == edge.from);
          let target = this.vertices.find((v) => v.id == edge.to);
          if (source == undefined || target == undefined || edge.relation != "child of") {
            console.error("source or target is undefined");
            return undefined;
          } else {
            return {
              source: source,
              relation: edge.relation,
              target: target,
            };
          }
        }).filter((edge) => edge != undefined) as any;
        this.createGraph();
      });
    });
  }

  ngOnInit(): void {
    // this.createGraph();
  }

  ngOnChanges() {
    this.simulation.stop();
  }

  createGraph() {
    const div: HTMLDivElement | null = document.querySelector('div');
    if (div == null) {
      console.error("div is null");
      return;
    }

    let zoom_attr = zoom().on('zoom', (e: any) => {
      select('svg g')
        .attr('transform', e.transform);
    });

    // append the svg object to the body of the page taking the full width available
    const height = div.clientHeight;
    const width = div.clientWidth;
    select('svg')
      .attr('width', width)
      .attr('height', height)
      .call(zoom_attr as any)
      .attr('viewBox', '0 0 5000 5000');

    let svg = select('svg g');

    this.link = svg
      .append('g')
      .selectAll('line')
      .data(this.edges)
      .enter()
      .append("path")
      .attr('class', "link")
      .style("stroke-width", 2)
      .style("stroke-opacity", 0.7)
      .style("stroke", (d, i, n) => {
        if (this.enableEdgeColors) {
          return d.relation == "child of" ? "#00F" : "#F00"
        }
        return "#000";
      });

    this.node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.vertices)
      .enter()
      .append('g');

    this.circles = this.node
      .append('circle')
      .attr('r', 10)
      .style('cursor', 'pointer')
      .on('click', (e: any) => window.open(e.srcElement.__data__.content.source, '_blank'))
      .call(
        drag()
          .on('start', (e, d: any) => this.dragstarted(e, d))
          .on('drag', (e, d: any) => this.dragged(e, d))
          .on('end', (e, d: any) => this.dragended(e, d)) as any
      );

    this.labels = this.node
      .append('text')
      .text((n: any) => n.content.title)
      .attr('x', 12)
      .attr('y', 3)
      .style('font-size', '12px')
    // .style('fill', (n: any) => this.colors[n.content.space_key])

    this.node.append('title').text((n: any) => n.id);

    svg.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 14)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .attr("fill", "#000")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");

    this.simulation
      .alpha(4)
      .force('charge', forceManyBody().strength(-35))
      .force('center', forceCenter(div.clientWidth / 2, div.clientHeight / 2))
      .force(
        'link',
        forceLink(this.edges as any).id((d: any) => d.id)
          .strength(0.5)
          .distance(200)
      )
      .force('collide', forceCollide(40))
      .tick()
      .on('tick', () => {
        this.node.attr('transform', (n: any) => 'translate(' + n.x + ',' + n.y + ')');
        if (this.enableNodeColors) {
          this.circles.style('fill', (n: any) => this.colors[(n.content as any).space_key])
          // this.node.attr('fill', (n: any) => this.colors[n.content.space_key]);
        } else {
          this.circles.attr('fill', "#000");
        }
        this.link.attr("d", function (d: any) {
          var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
          // get the total link numbers between source and target node
          // var lTotalLinkNum = mLinkNum[d.source.id + "," + d.target.id] || mLinkNum[d.target.id + "," + d.source.id];
          // if (lTotalLinkNum > 1) {
          //     // if there are multiple links between these two nodes, we need generate different dr for each path
          //     dr = dr / (1 + (1 / lTotalLinkNum) * (d.linkindex - 1));
          // }
          // generate svg path
          return "M" + d.source.x + "," + d.source.y +
            "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y +
            "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y;
          // return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;


        }).attr("marker-end", "url(#arrow)");
      });
  }

  dragstarted(e: any, d: SimulationNodeDatum) {
    if (!e.active) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = e.x;
    d.fy = e.y;
  };

  dragged(e: any, d: SimulationNodeDatum) {
    d.fx = e.x;
    d.fy = e.y;
  };

  dragended(e: any, d: SimulationNodeDatum) {
    if (!e.active) {
      this.simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  };
}
