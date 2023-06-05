import { Component } from '@angular/core';
import {
  select,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  scaleOrdinal,
  schemeCategory10,
  drag,
  SimulationNodeDatum,
} from 'd3';
import * as d3 from 'd3';
import { CarpenterService } from '../carpenter.service';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph.page.component.html',
  styleUrls: ['./graph.page.component.scss']
})
export class GraphPageComponent {
  public vertices: Array<{
    id: string,
    content: {}
  }> = [];
  public edges: Array<{
    source: any,
    target: any
  }> = [
    ];

  // private vertices = [
  //   { index: 0, name: '', group: 0 },
  //   { index: 1, name: 'Fruit', group: 1 },
  //   { index: 2, name: 'Vegetable', group: 2 },
  //   { index: 3, name: 'Orange', group: 1 },
  //   { index: 4, name: 'Apple', group: 1 },
  //   { index: 5, name: 'Banana', group: 1 },
  //   { index: 6, name: 'Peach', group: 1 },
  //   { index: 7, name: 'Bean', group: 2 },
  //   { index: 8, name: 'Pea', group: 2 },
  //   { index: 9, name: 'Carrot', group: 2 },
  // ];
  // private edges = [
  //   { source: this.vertices[0], target: this.vertices[1] },
  //   { source: this.vertices[0], target: this.vertices[2] },
  //   { source: this.vertices[1], target: this.vertices[3] },
  //   { source: this.vertices[1], target: this.vertices[4] },
  //   { source: this.vertices[1], target: this.vertices[5] },
  //   { source: this.vertices[1], target: this.vertices[6] },
  //   { source: this.vertices[2], target: this.vertices[7] },
  //   { source: this.vertices[2], target: this.vertices[8] },
  //   { source: this.vertices[2], target: this.vertices[9] },
  // ];

  private color = scaleOrdinal(schemeCategory10);

  constructor(
    private carpenter: CarpenterService,
  ) {
    this.carpenter.get_vertices().subscribe((vertices) => {
      this.vertices = vertices;
      this.carpenter.get_edges().subscribe((edges) => {
        this.edges = edges.map((edge) => {
          let source = this.vertices.find((v) => v.id == edge.from);
          let target = this.vertices.find((v) => v.id == edge.to);
          if (source == undefined || target == undefined) {
            console.error("source or target is undefined");
            return undefined;
          } else {
            return {
              source: source,
              target: target,
            };
          }
        }).filter((edge) => edge != undefined) as any;
        this.createGraph();
      });
    });
  }

  createGraph() {
    const div: HTMLDivElement | null = document.querySelector('div');
    if (div == null) {
      console.error("div is null");
      return;
    }

    let zoom = d3.zoom().on('zoom', (e: any) => {
      d3.select('svg g')
        .attr('transform', e.transform);
    });

    // append the svg object to the body of the page taking the full width available
    const height = div.clientHeight;
    const width = div.clientWidth;
    d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .call(zoom as any)
      .attr('viewBox', '0 0 5000 5000');


    let svg = d3.select('svg g');

    console.log(div.clientWidth);

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', 3)
      .selectAll('line')
      .data(this.edges)
      .join('line');

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(this.vertices)
      .enter()
      .append('g');

    const circles = node
      .append('circle')
      .attr('r', 10)
      .style('fill', (n) => this.color((n.content as any).space))
      .style('cursor', 'pointer')
      .on('click', (e) => window.open(e.srcElement.__data__.content.source, '_blank'))
      .call(
        drag()
          .on('start', (e, d: any) => dragstarted(e, d))
          .on('drag', (e, d: any) => dragged(e, d))
          .on('end', (e, d: any) => dragended(e, d)) as any
      );

    const labels = node
      .append('text')
      .text((n: any) => n.content.title)
      .attr('x', 12)
      .attr('y', 3)
      .style('font-size', '12px')
    // .style('color', (n) => this.color('' + n.group));

    node.append('title').text((n: any) => n.id);

    const simulation = forceSimulation(this.vertices as any)
      .force('charge', forceManyBody().strength(-30))
      .force('center', forceCenter(div.clientWidth / 2, div.clientHeight / 2))
      .force(
        'link',
        forceLink(this.edges as any).id((d: any) => d.id)
          .distance(200)
      )
      .tick()
      .on('tick', () => {
        node.attr('transform', (n: any) => 'translate(' + n.x + ',' + n.y + ')');
        link
          .attr('x1', (l: any) => l.source.x)
          .attr('y1', (l: any) => l.source.y)
          .attr('x2', (l: any) => l.target.x)
          .attr('y2', (l: any) => l.target.y);
      });

    const dragstarted = (e: any, d: SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (e: any, d: SimulationNodeDatum) => {
      d.fx = e.x;
      d.fy = e.y;
    };

    const dragended = (e: any, d: SimulationNodeDatum) => {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };
  }
}
