import { ComponentStore } from "@ngrx/component-store";
import { BusService } from "./bus.service";

export interface BusStates {

}

const defaultState: BusStates = {};

export class BusStore extends ComponentStore<BusStates> {
  constructor(private busService: BusService) {
    super(defaultState);
  }
}
