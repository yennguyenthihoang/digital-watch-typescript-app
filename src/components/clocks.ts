import { DigitalClock } from './digitalClock';
import * as momentTZ from 'moment-timezone';

type parametersInitclock = {
    id: string;
    city: string;
    timezone: string;
}

export class Clocks {
    parametersInitclocks: parametersInitclock[] = [
        { id: '', city: 'Paris', timezone: 'Europe/Paris'},
        { id: '', city: 'New York', timezone: 'America/New_York'},
        { id: '', city: 'Ho Chi Minh', timezone: 'Asia/Bangkok'},
        { id: '', city: 'Qatar', timezone: 'Asia/Qatar'},
        { id: '', city: 'Hongkong', timezone: 'Hongkong'},
    ];
    clocks: DigitalClock[];
    clocksElements: HTMLElement;
    timezones: string[];
    newClockTimeZone: string;

    public constructor(container: HTMLElement) {
        this.timezones = momentTZ.tz.names();
        this.newClockTimeZone = this.timezones[0];
        this.clocks = [];
        this.clocksElements = container;
        this.init();
    }

    init() {
        this.parametersInitclocks.forEach(parametersInitclock => {
            let id = `clock-${parametersInitclock.timezone}-${parametersInitclock.city}`;
            parametersInitclock.id = id;
            this.renderUIClocks(id);
            let clock = new DigitalClock(document.getElementById(id), parametersInitclock.timezone, parametersInitclock.city);
            this.clocks.push(clock);
        });

        this.renderUITimezonesSelection(this.clocksElements.querySelector("#timezonesSelection"));
        let formEle = this.clocksElements.querySelector("#addFormId");
        formEle.addEventListener('submit', this.addNewClock.bind(Event, formEle, this), false);
    }

    renderUIClocks(id: string) {
        let clockDiv = document.createElement('div');
        clockDiv.classList.add('clock');
        clockDiv.setAttribute("id", id);
        this.clocksElements.appendChild(clockDiv);
    }

    renderUITimezonesSelection(selection: HTMLSelectElement) {
        selection.setAttribute("value", this.newClockTimeZone);
        this.timezones?.forEach(select => {
            var newoption = document.createElement("option");
            newoption.textContent = select;
            selection.add(newoption);
        });
    }

    addNewClock(container: HTMLElement, _clocks: Clocks, e: Event){
        e.preventDefault();
        _clocks.newClockTimeZone = (container.querySelector("#timezonesSelection") as HTMLSelectElement).value;

        let newParameterClock =  { id: 'clock'+ _clocks.newClockTimeZone?.split("/")[0] + '_' + _clocks.newClockTimeZone?.split("/")[1], 
        city: _clocks.newClockTimeZone?.split("/")[1], 
        timezone: _clocks.newClockTimeZone};

        _clocks.parametersInitclocks.push(newParameterClock);
        _clocks.renderUIClocks(newParameterClock.id);
        let newClock = new DigitalClock(document.getElementById(newParameterClock.id), newParameterClock.timezone, newParameterClock.city);
        _clocks.clocks.push(newClock);
    }

}