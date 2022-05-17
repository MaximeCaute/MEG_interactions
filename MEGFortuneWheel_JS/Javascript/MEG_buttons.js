console.log("Asking for next message... will be printed upon arrival")

// Here we ask to print (**after**) answer, but could be about anything.
//tryGetMessage(console.log)
//tryGetMessage(alert)

//tryGetMessage(console.log)

tryGetMessage(function(message){
    console.log(message)
    if(message == "redraw"){
        redrawSample()
    } else if(message == "next_trial"){
        runForagingTask()
    } else if(message == "accept"){
        acceptOffer()
    }
})


