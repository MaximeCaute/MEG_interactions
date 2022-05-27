#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
The conductor of the experiments, that makes communicating with MEG

Usage:
  conductor.py <NIP> <participant_number> [--no-meg]
  conductor.py (-h | --help)
"""

import asyncio
import csv
import datetime
import time
import sys
import json

import expyriment
import docopt
import mywebsockets as websockets

import bit_encoder

args = docopt.docopt(__doc__)
ID = args["<NIP>"] + "_sub-" + args["<participant_number>"]
colnames = ["idx", "type", "shap", "outT", "nblk", "rot_", "dil_", "value", "human_value", "t_js", "t_py"]


class MetaPort:
    """Writes triggers to a file, and when a MEG is connected send it there"""
    i = 0
    run_type = ""

    def __init__(self):
        self.items_list = []
        self.is_connected = False
        self.actual_meg = None
        self.file_handle = None

        fname = "data/"
        fname += ID + "_"
        fname += datetime.datetime.now().strftime("%Y-%m-%dT%H%M%S")+'.csv'
        self.file_handle = open(fname, 'w', encoding="utf-8")
        self.csvwriter = csv.writer(self.file_handle, delimiter=',')
        self.csvwriter.writerow(colnames)
        if not args["--no-meg"]:
            try:
                self.actual_meg = expyriment.io.ParallelPort(address=0x0378)
            except RuntimeError:
                print("\nERROR: could not connect to the parallel port 0x0378")
                sys.exit(1)
            self.actual_meg.send(0)
            self.is_connected = True
        else:
            print("####################################################")
            print("# ONLY mock port in use, no actual trigger is sent #")
            print("#          IS THIS WHAT YOU WANT???                #")
            print("####################################################")

    def write(self, message):
        """Writes a dict to a file, possibly writes to triggers"""
        value = None
        human_value = None
        message["t_py"] = datetime.datetime.now().isoformat()
        if message["type"] == "geom_stimulus":
            shape = message["shap"]
            out_type = message["outT"]
            value = bit_encoder.encode_passive_static((shape, out_type))
            human_value = bit_encoder.info_to_string(value)
            if self.is_connected:
                self.actual_meg.send(value)
                print(f"MEG should have received: {value:b}")
                time.sleep(0.04)
                self.actual_meg.send(0)
            else:
                print(f"#          Would have sent: {value}             #")
        message["value"] = value
        message["human_value"] = human_value
        message["idx"] = self.i
        self.csvwriter.writerow([message[x] for x in colnames])
        self.i = self.i + 1

    def close(self):
        """Ensures the MEG is back to 0, and closes the file handle"""
        if self.is_connected:
            self.actual_meg.send(0)
        self.file_handle.close()


async def connect(websocket):
    """
    When exp starts, log timestamp and initiate NetStation.
    Note that the presentation needs to be informed about the eyetracker, so we
    don't start the block right away but instead we notify the presentation of
    whether ET is in order or not.
    """
    meg = MetaPort()
    await websocket.send(ID)

    return meg


async def disconnect(_, meg):
    """When exp terminates, close the NetStation and the ET
    """
    meg.close()


async def conductor(websocket, _):
    """
    When a new connection gets in:
        * Call "connect" to initiate stuff
        * Then indifinitely wait for messages and act accordingly
        * Disconnect is automatically called on proper disconnection,
          try/finally enforces it also in case of bug to get meaningful bug
          information
    """
    meg = await connect(websocket)
    try:
        async for message in websocket:
            meg.write(json.loads(message))
    finally:
        await disconnect(websocket, meg)


asyncio.get_event_loop().run_until_complete(
    websockets.serve(conductor, "localhost", 8765)
)
asyncio.get_event_loop().run_forever()
