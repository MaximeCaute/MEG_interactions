#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May 11 11:38:32 2022

@author: Maxime Cauté
"""
import expyriment
import time

# We create a function to get time because we might want to change 
# for better clocks in the future
# Time is returned in MS
def get_time():
    return time.time() * 1000

class MEGPortsListener:
    def __init__(self, port_adresses):
        if type(port_adresses) == type(0):
            port_adresses = [port_adresses]
        
        self.meg_ports = []
        
        for port_adress in port_adresses:
            try:
                self.meg_ports.append(
                    expyriment.io.ParallelPort(address=port_adress)
                )
            except RuntimeError:
                print("\nERROR: could not connect to the parallel port "+port_adress)
                
        self.default_port_outputs = [
            port.read_data() for port in self.meg_ports
        ]
            
    def get_port_data(self):
        return [port.read_data() for port in self.meg_ports]
    
    # Tests ports at given time
    def check_for_responses(self):
        ports_index_and_data = [
            (i, port.read_data()) for i, port in enumerate(self.meg_ports)
        ]
        
        def is_nondefault_data(port_index_and_data):
            # Unwrapped, wrapped because of lambda use
            port_index, port_data = port_index_and_data
            
            return port_data != self.default_port_outputs[port_index]
        
        responses = list(filter(
            is_nondefault_data,
            ports_index_and_data
        ))

        return responses

    # RT in ms
    # Waits for a response and tells which and with what rt.
    def wait_for_response(self, no_multiple_response = True):
        start_time = get_time()
        rt = None
        
        # Clear buffer:
        _ = [port.read_data() for port in self.meg_ports]
        
        while True:
            responses = self.check_for_responses()
            
            if no_multiple_response:
                if len(responses) == 1:
                    rt = int(get_time() - start_time)
                    response = responses[0]

                    return responses[0], rt
            elif len(responses) > 0:
                rt = int(get_time() - start_time)
                return responses, rt
                
if __name__ == "__main__":
    ports_listener = MEGPortsListener(
        ['/dev/' + pp for pp in expyriment.io.ParallelPort.get_available_ports()]
    )
    print(ports_listener.default_port_outputs)
    print(ports_listener.wait_for_response())
    