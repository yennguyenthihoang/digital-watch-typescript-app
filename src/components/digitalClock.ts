import * as moment from 'moment';

export class DigitalClock {
    id: string;
    timezone: number;
    strTimezone: string;
    hours: number;
    minutes: number;
    seconds: number;
   
    editableMode: number;
    displayMode: boolean;
    merdiem: string;
    light: boolean;
    city: string;
    locale: string;

    public constructor(container: HTMLElement, _strTimezone: string, _city: string) {
        this.id = `clock-${_strTimezone}-${_city}`;
        this.timezone = parseInt(moment().tz(_strTimezone).format('z'));
        this.strTimezone = _strTimezone;
        this.city = _city;
        this.displayMode = false;
        this.editableMode = 0;
        this.light = false;
        this.merdiem = '';

        const currentTime = this.getCurrentTime();
        this.hours = currentTime.hours;
        this.minutes = currentTime.minutes;
        this.seconds = currentTime.seconds;

        this.renderUIClock(container);
        this.init(container);

        // events for buttons
        let btnEditableModeElement = container.querySelector('.mode-btn');
        btnEditableModeElement?.addEventListener("click", this.pressModeBtn.bind(null, Event, container, this));

        let btnIncreaseElement = container.querySelector('.increase-btn');
        btnIncreaseElement?.addEventListener("click", this.pressIncreaseBtn.bind(null, Event, container, this));

        let btnLightElement = container.querySelector('.light-btn');
        btnLightElement?.addEventListener("click", this.pressLightBtn.bind(null, Event, container, this));

        let btnResetElement = container.querySelector('.reset-btn');
        btnResetElement?.addEventListener("click", this.reset.bind(null, Event, container, this));

        let btnMeridiemElement = container.querySelector('.meridiem-btn');
        btnMeridiemElement?.addEventListener("click", this.changeDisplayMode.bind(null, Event, container, this));
    }

    init(container: HTMLElement) {
        this.displayTime(container);
        this.updateModeBtn(container);
        setInterval(()=>{
            this.updateClock(container);
            }, 1000);
    }

    renderUIClock(container: HTMLElement) {
        let cityH1 = document.createElement('h1');
        cityH1.classList.add('city');
        cityH1.innerText = this.city;
        container.appendChild(cityH1);

        let timezoneH1 = document.createElement('h1');
        timezoneH1.classList.add('timezone');
        timezoneH1.innerText = this.strTimezone;
        container.appendChild(timezoneH1);

        let buttonDiv = document.createElement('div');
        buttonDiv.classList.add('button');

        let modeBtn = document.createElement('button');
        modeBtn.classList.add('button');
        modeBtn.classList.add('mode-btn');
        buttonDiv.appendChild(modeBtn);
        let increaseBtn = document.createElement('button');
        increaseBtn.classList.add('button');
        increaseBtn.classList.add('increase-btn');
        increaseBtn.innerHTML = 'Increase';
        buttonDiv.appendChild(increaseBtn);
        let lightBtn = document.createElement('button');
        lightBtn.classList.add('button');
        lightBtn.classList.add('light-btn');
        lightBtn.innerHTML = 'Light';
        buttonDiv.appendChild(lightBtn);
        container.appendChild(buttonDiv);

        let faceClockDiv = document.createElement('div');
        faceClockDiv.classList.add('face-clock');
        let clockTextSpan = document.createElement('span');
        clockTextSpan.classList.add('clock-text');
        faceClockDiv.appendChild(clockTextSpan);
        faceClockDiv.appendChild(document.createElement('br'));

        let meridiemSub = document.createElement('sub');
        meridiemSub.classList.add('meridiem');
        faceClockDiv.appendChild(meridiemSub);

        container.appendChild(faceClockDiv);     

        let buttonDiv2 = document.createElement('div');
        buttonDiv.classList.add('button');

        let resetBtn = document.createElement('button');
        resetBtn.classList.add('button');
        resetBtn.classList.add('reset-btn');
        resetBtn.innerHTML = 'Reset';
        buttonDiv2.appendChild(resetBtn);
        let meridiemBtn = document.createElement('button');
        meridiemBtn.classList.add('button');
        meridiemBtn.classList.add('meridiem-btn');
        meridiemBtn.innerHTML = 'Show meridiem'
        buttonDiv2.appendChild(meridiemBtn);
        container.appendChild(buttonDiv2);      
    }

    changeEditableMode() {
        this.editableMode = (this.editableMode + 1)%3;
    }

    updateClock(container: HTMLElement) {
        let newHours = this.hours;
        let newMinutes =this.minutes;
        let newSeconds = this.seconds + 1;
        let newMerdiem = this.merdiem;

        if(newSeconds === 60) {
            newMinutes++;
            newSeconds = 0;
            if(newMinutes === 60){
                newHours++;
                newMinutes = 0;
                if(newHours === 24) {
                    newHours = 0;
                }
                
                if(this.displayMode){
                    newMerdiem = (newHours < 12) ? 'AM' : 'PM';
                }
            }
        }
        
        this.hours = newHours;
        this.minutes = newMinutes;
        this.seconds = newSeconds;
        this.merdiem = newMerdiem;
        this.displayTime(container);
    }

    displayTime(container: HTMLElement) {
        let _hours = this.displayMode ? this.hours%12 : this.hours;
        if(_hours === 0 && this.displayMode){
            _hours = 12;
        }
        const _merdiem = this.displayMode ? this.merdiem : '';
        

        const timeString = `${_hours < 10 ? '0' + _hours: _hours}:${this.minutes < 10 ? '0' + this.minutes : this.minutes}:${this.seconds < 10 ? '0' + this.seconds : this.seconds}`;
        container.querySelector(".clock-text").textContent = timeString;

        const merdiemString = `${' ' + _merdiem }`;
        (container.querySelector(".meridiem") as HTMLInputElement).textContent = merdiemString;
    }
  
    getCurrentTime() {
      const now = new Date();
  
      return {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };
    }

    updateModeBtn(container: HTMLElement) {
        container.querySelector(".mode-btn").textContent = 'Mode ' + this.editableMode;
    }

    /**
     * State Mode value default is 0, 1 is hour editable, 2 is minute editable
     */
    pressModeBtn(e: Event, container: HTMLElement, clock: DigitalClock) {
        clock.changeEditableMode();
        clock.updateModeBtn(container);
    }

    /**
     * Mode is 0: do nothing
     * Mode is 1: increase hour
     * Mode is 2: increase minute
     */
    pressIncreaseBtn(e: Event, container: HTMLElement, clock: DigitalClock) {
        let newHours = clock.hours;
        let newMinutes = clock.minutes;
        switch(clock.editableMode){
            case 1:
                newHours++;
                if(newHours === 24){
                    newHours = 0;
                }
                clock.hours = newHours;
                break;
            case 2:
                newMinutes++;
                if(newMinutes === 60) {
                    newMinutes = 0;
                }
                clock.minutes = newMinutes;
                break;
            default:
                break;
        }
        clock.displayTime(container);
    }

    /**
     * Light Mode is on: true
     * Light mode is off: false
     */
    pressLightBtn(e: Event, container: HTMLElement, clock: DigitalClock) {
        clock.light = !clock.light;
        if(clock.light){
            container.querySelector(".face-clock").classList.add('active');
        }else {
            container.querySelector(".face-clock").classList.remove('active');
        }
    }

    reset(e: Event, container: HTMLElement, clock: DigitalClock) {
        const {
            hours,
            minutes,
            seconds,
            } = clock.getCurrentTime();
        clock.hours = hours;
        clock.minutes = minutes;
        clock.seconds = seconds;
        clock.displayTime(container);
    }

    changeDisplayMode(e: Event, container: HTMLElement, clock: DigitalClock) {
        clock.merdiem = (clock.hours < 12) ? 'AM' : 'PM';
        clock.displayMode = !clock.displayMode;
        clock.displayTime(container);
    }
}
  