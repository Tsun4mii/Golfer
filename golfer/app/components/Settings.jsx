"use client";
import React, { useState } from "react";
import { geneticSolver } from "../utils/golfer";

const Settings = () => {
  const [groups, setGroups] = useState(3);
  const [size, setSize] = useState(4);
  const [rounds, setRounds] = useState(5);
  const [result, setResult] = useState();
  const [names, setNames] = useState([]);

  const calculate = async () => {
    console.time("speed");
    let golfer = geneticSolver(groups, size, rounds, [], []);
    let res = golfer.next();
    while (!res.value.done) {
      console.log(res.value);
      setResult(res.value);
      res = golfer.next();
    }
    console.timeEnd("speed");
    console.log(result);
    return;
  };

  const nameSplit = (string) => {
    const resultNamesArr = string.split(/\r?\n/);
    setNames(resultNamesArr);
    return;
  };

  return (
    <div className="flex flex-col m-[10px] gap-[20px] bg-card-bg rounded-[20px] p-[20px] min-w-[270px]">
      <button
        className="bg-button-bg hover:bg-button-hover active:bg-button-active rounded-[15px] h-[40px] text-button-text"
        onClick={(e) => calculate()}
      >
        Calculate
      </button>
      <div className="flex flex-row gap-4">
        <input
          type="range"
          min={0}
          max={50}
          value={groups}
          onChange={(e) => setGroups(e.target.value)}
        />
        <p>{groups}</p>
      </div>
      <div className="flex flex-row gap-4">
        <input
          type="range"
          min={0}
          max={15}
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <p>{size}</p>
      </div>
      <div className="flex flex-row gap-4">
        <input
          type="range"
          min={0}
          max={20}
          value={rounds}
          onChange={(e) => setRounds(e.target.value)}
        />
        <p>{rounds}</p>
      </div>
      <textarea
        rows={20}
        className="outline rounded-[5px] text-[14px] placeholder-card-text focus:border focus:border-primary pl-[15px] pt-[15px]"
      />
    </div>
  );
};

export default Settings;
