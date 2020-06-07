import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";

import { Activity } from '../scheduler/model/activity';
import { ChangeActivityArg } from '../scheduler/changeactivityarg';
import { ActivityRoomTime } from '../model/activityroomtime';
import { KeyValuePair } from '../model/keyvaluepair';
import { DataService } from '../model/dataservice';

import { tap } from 'rxjs/operators';

@Injectable()
export class ActivityService {
  private activities: any;
  private nqkuvResult: any;

  constructor(private dataservice: DataService, private http: HttpClient) {}

  async getMeetings() {
    let result: any;
    result = await this.dataservice.sendGetRequest()
  }

  getActivity(search: ChangeActivityArg): Observable<object> {

    let list = this.getActivityList();

    this.getMeetings();

    if (search.roomId !== 0) {
      list = list.filter(l => l.roomId === search.roomId);
    }

    if (search.type === 'giorno') {
      list = list.filter(l => l.date.getTime() === search.date.getTime());
    } else {
      list = list.filter(l => l.date.getTime() >= search.dateStart.getTime()
                 && l.date.getTime() <= search.dateEnd.getTime());
    }

    return of(list);
  }

  insertActivity(activity: Activity): Observable<string> {



    console.log('INSERT')
    //PUT REQUEST
    const list = this.getActivityList();

    for (const item of list) {
      if (activity.date.getTime() === item.date.getTime()) {
        if (activity.activityId !== item.activityId && activity.roomId === item.roomId) {
          if (activity.startTime >= item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong startTime ' + activity.startTime);
          }
          if (activity.endTime > item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong endTime ' + activity.endTime);
          }
        }
      }
    }
    activity.activityId = this.maxValue(list) + 1;

    console.log("Current activity: " + activity.startTime)
    console.log("Current activity: " + activity.endTime)
    console.log("Current activity: " + activity.description)
    console.log("Current activity: " + activity.title)

    let data = {
      "name": activity.title + activity.description,
      "start": activity.startTime,
      "end": activity.endTime,
      "roomId": activity.roomId
    }

    console.log('This is the data Im sending', data);

    this.dataservice.sendPostRequest(data);

    list.push(activity);

    return of('ok');
  }

  updateActivity(activity: Activity): Observable<string> {
    const list = this.getActivityList();

    for (const item of list) {
      if (activity.date.getTime() === item.date.getTime()) {
        if (activity.activityId !== item.activityId && activity.roomId === item.roomId) {
          if (activity.startTime >= item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong startTime ' + activity.startTime);
          }
          if (activity.endTime > item.startTime && activity.startTime < item.endTime) {
            return throwError('wrong endTime ' + activity.endTime);
          }
        }
      }
    }


    const index = list.findIndex(x => x.activityId === activity.activityId);

    console.log('THE INDEX IS: ', index);

    var id = index % 10 + 1;
    this.dataservice.sendPutRequest(id, list[index]);
    list[index] = activity;

    return of('ok');
  }

  deleteActivity(id: number): Observable<string> {
    const list = this.getActivityList();

    const index = list.findIndex(x => x.activityId === id);

    this.dataservice.sendPutRequest(id, list[index]);
    //List splice but has to be like in memory so fuck it
    list.splice(index, 1);

    return of('ok');
  }

  getActivityRoomTime(): Observable<object> {
    const data = new ActivityRoomTime();

    data.rooms.push(new KeyValuePair<number, string>(1, 'Rooom Tsarevets'));
    data.rooms.push(new KeyValuePair<number, string>(3, 'Rooom Arbanasi'));

    data.startTimes.push(new KeyValuePair<string, string>('08.00', '08.00'));
    data.startTimes.push(new KeyValuePair<string, string>('08.30', '08.30'));
    data.startTimes.push(new KeyValuePair<string, string>('09.00', '09.00'));
    data.startTimes.push(new KeyValuePair<string, string>('09.30', '09.30'));
    data.startTimes.push(new KeyValuePair<string, string>('10.00', '10.00'));
    data.startTimes.push(new KeyValuePair<string, string>('10.30', '10.30'));
    data.startTimes.push(new KeyValuePair<string, string>('11.00', '11.00'));
    data.startTimes.push(new KeyValuePair<string, string>('11.30', '11.30'));
    data.startTimes.push(new KeyValuePair<string, string>('12.00', '12.00'));
    data.startTimes.push(new KeyValuePair<string, string>('14.00', '14.00'));
    data.startTimes.push(new KeyValuePair<string, string>('14.30', '14.30'));
    data.startTimes.push(new KeyValuePair<string, string>('15.00', '15.00'));
    data.startTimes.push(new KeyValuePair<string, string>('15.30', '15.30'));
    data.startTimes.push(new KeyValuePair<string, string>('16.00', '16.00'));
    data.startTimes.push(new KeyValuePair<string, string>('16.30', '16.30'));
    data.startTimes.push(new KeyValuePair<string, string>('17.00', '17.00'));
    data.startTimes.push(new KeyValuePair<string, string>('17.30', '17.30'));

    data.endTimes.push(new KeyValuePair<string, string>('08.30', '08.30'));
    data.endTimes.push(new KeyValuePair<string, string>('09.00', '09.00'));
    data.endTimes.push(new KeyValuePair<string, string>('09.30', '09.30'));
    data.endTimes.push(new KeyValuePair<string, string>('10.00', '10.00'));
    data.endTimes.push(new KeyValuePair<string, string>('10.30', '10.30'));
    data.endTimes.push(new KeyValuePair<string, string>('11.00', '11.00'));
    data.endTimes.push(new KeyValuePair<string, string>('11.30', '11.30'));
    data.endTimes.push(new KeyValuePair<string, string>('12.00', '12.00'));
    data.endTimes.push(new KeyValuePair<string, string>('14.00', '14.00'));
    data.endTimes.push(new KeyValuePair<string, string>('14.30', '14.30'));
    data.endTimes.push(new KeyValuePair<string, string>('15.00', '15.00'));
    data.endTimes.push(new KeyValuePair<string, string>('15.30', '15.30'));
    data.endTimes.push(new KeyValuePair<string, string>('16.00', '16.00'));
    data.endTimes.push(new KeyValuePair<string, string>('16.30', '16.30'));
    data.endTimes.push(new KeyValuePair<string, string>('17.00', '17.00'));
    data.endTimes.push(new KeyValuePair<string, string>('17.30', '17.30'));
    data.endTimes.push(new KeyValuePair<string, string>('18.00', '18.00'));

    return of(data);
  }

  private getActivityList(): Activity[] {
    if (this.activities) {
      return this.activities;
    }
    const b = new Array<Activity>();
    this.activities = b;

    let index = 1;
    let flag = false;
    for (let y = 2020; y < 2021; ++y) {
      for (let m = 0; m < 12; ++m) {
        const dm = new Date(y, m + 1, 0);
        for (let d = 0; d < dm.getDate(); ++d) {
          const dt = new Date(y, m, d);
          if (dt.getDay() === 1) {
            if (flag === false) {
              this.createActivity1(b, y, m, d, index);
              index = index + 26;
              flag = true;
            } else {
              this.createActivity2(b, y, m, d, index);
              index = index + 13;
              flag = false;
            }
          }
        }
      }
    }
    
    let additional = this.getMeetings();
    console.log("Those are the additional: " + additional)
    let additionalActivities: Activity[];
    /*
    for(let i = 0; i < additional.length; i++) {
      let current = additional[i];
      let activity: Activity;
      activity.startTime = current.start;
      activity.endTime = current.end;
      activity.roomId = current.roomId;
      activity.title = current.title;
      activity.description = current.description;
      activity.activityId = this.maxValue(b) + 1;
      b.push(activity);
    } */

    return b;
  }

  private createActivity1(a, y, m, d, bid) {   
    //Customly added activities for test 
    let activity: Activity;
    
    activity = new Activity();
    activity.activityId = bid;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '08.00';
    activity.endTime = '08.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 1;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 2;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '15.00';
    activity.endTime = '15.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 3;
    activity.roomId = 1;
    activity.date = new Date(y, m, d);
    activity.startTime = '16.00';
    activity.endTime = '16.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new Activity();
    activity.activityId = bid + 4;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 5;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 6;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 7;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 8;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 9;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 10;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new Activity();
    activity.activityId = bid + 11;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '08.00';
    activity.endTime = '08.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 12;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 13;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '15.00';
    activity.endTime = '15.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 14;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 2);
    activity.startTime = '16.00';
    activity.endTime = '16.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new Activity();
    activity.activityId = bid + 15;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 16;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 17;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 18;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 19;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 20;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 21;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new Activity();
    activity.activityId = bid + 22;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '08.00';
    activity.endTime = '08.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 23;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 24;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '15.00';
    activity.endTime = '15.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 25;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 4);
    activity.startTime = '16.00';
    activity.endTime = '16.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
  }

  private createActivity2(a, y, m, d, bid) {
    let activity: Activity;

    activity = new Activity();
    activity.activityId = bid;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 1;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 2;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 3;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 4;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 5;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 6;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 1);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);

    activity = new Activity();
    activity.activityId = bid + 7;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 8;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '08.30';
    activity.endTime = '09.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 9;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '09.00';
    activity.endTime = '09.30';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 10;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 11;
    activity.roomId = 2;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '10.00';
    activity.endTime = '12.00';
    activity.stepDuration = 4;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 12;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '15.30';
    activity.endTime = '16.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity);
    activity = new Activity();
    activity.activityId = bid + 13;
    activity.roomId = 1;
    activity.date = new Date(y, m, d + 3);
    activity.startTime = '16.30';
    activity.endTime = '17.00';
    activity.stepDuration = 1;
    activity.title = 'title ' + activity.activityId;
    activity.description = 'description ' + activity.activityId;
    a.push(activity); 
  }

  private maxValue(list: Activity[]): number {
    return list.reduce((max, p) => p.activityId > max ?
         p.activityId : max, list[0].activityId);
  }

}
