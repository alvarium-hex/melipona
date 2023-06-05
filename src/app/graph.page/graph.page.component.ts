import { Component, Input } from '@angular/core';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
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
  @Input() public vertices: Array<{
    id: string,
    content: {}
  }> = [];

  @Input() public edges: Array<{
    source: any,
    relation: string,
    target: any
  }> = [];

  enableNodeColors = true;
  enableEdgeColors = false;

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
              relation: edge.relation,
              target: target,
            };
          }
        }).filter((edge) => edge != undefined) as any;
      });
    });
  }


}
