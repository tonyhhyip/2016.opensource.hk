'use strict';

import navBar from "./utils/navBar";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Store from "./apps/Programmes/Store";
import TicketButton from './apps/TicketButton';
import Programmes from "./apps/Programmes/Programmes";

import speakers from "../data/speakers.json";
import topics   from "../data/topics.json";
import langs    from "../data/langs.json";

navBar();


let ticketDiv = document.getElementById('ticket');
if ((typeof ticketDiv !== "undefined") && (ticketDiv !== null)) {
  render((
    <TicketButton
      className="btn btn-lg btn-hkosc button-front-mobile-ticket"
      target="_blank"
      href="https://hkoscon2016.eventbrite.com/?aff=website" />
    ),
    ticketDiv
  );
}

// translate data into array that's suitable for
// store to filter
function topicStoreAll(data = {topics: {}}) {
  var all = [];
  for (let id in topics) {
    let topic = topics[id];
    all.push({
      topic,
      category: [topic.category],
      target_audience: topic.target_audience,
      level: topic.level
    });
  }
  return all;
}

var data = {speakers, topics, langs};
var all = topicStoreAll();
var store = Store({
  data,
  all,
  filters: {},
  display: all
});

let timetableDiv = document.getElementById('timetable');
if ((typeof timetableDiv !== "undefined") && (timetableDiv !== null)) {
  render((
      <Provider store={store}>
        <Programmes/>
      </Provider>
    ),
    timetableDiv
  );
}
