var memoryjs = require('./build/Release/memoryjs');
var processName = "csgo.exe";
var processModule;
var offset = 0x00A9D44C;

// open a process (sync)
var process = memoryjs.openProcess(processName);

// open a process (async)
memoryjs.openProcess(processName, function (process) {
    console.log(JSON.stringify(process, null, 3));
    if (process.szExeFile) {
        console.log("Successfully opened handle on", processName);

        memoryjs.closeProcess(process.handle);
        console.log("Closed handle on", processName)
    } else {
        console.log("Unable to open handle on", processName);
    }
});

// get all processes (sync)
var processes = memoryjs.getProcesses();
console.log("\nGetting all processes (sync)\n---\n");
for (var i = 0; i < processes.length; i++) {
    console.log(processes[i].szExeFile);
}

// get all processes (async)
console.log("\nGetting all processes (async)\n---\n");
memoryjs.getProcesses(function(processes){
    for (var i = 0; i < processes.length; i++) {
        console.log(processes[i].szExeFile);
    }
});

/* process =
{  cntThreads: 47,
   szExeFile: "csgo.exe",
   th32ProcessID: 10316,
   th32ParentProcessID: 7804,
   pcPriClassBase: 8 } */

// get all modules (sync)
console.log("\nGetting all modules (sync)\n---\n");
var modules = memoryjs.getModules(process.th32ProcessID);
for (var i = 0; i < modules.length; i++) {
    console.log(modules[i].szExePath);
}

// get all modules (async)
console.log("\nGetting all modules (async)\n---\n");
memoryjs.getModules(process.th32ProcessID, function (modules) {
    for (var i = 0; i < modules.length; i++) {
        console.log(modules[i].szModule);
    }
});

memoryjs.getModules(process.th32ProcessID, function(modules){
  for(var i = 0; i < modules.length; i++){
    //console.log(JSON.stringify(modules, null, 3));
  }
});

// find a module associated with a process (sync)
console.log("\nFinding module \"client.dll\" (sync)\n---\n");
console.log(memoryjs.findModule("client.dll", process.th32ProcessID));

// find a module associated with a process (async)
console.log("\nFinding module \"client.dll\" (async)\n---\n");
memoryjs.findModule("client.dll", process.th32ProcessID, function (module) {
    console.log(module.szModule);
    processModule = module;
});

/* module =
{ modBaseAddr: 468123648,
  modBaseSize: 80302080,
  szExePath: 'c:\\program files (x86)\\steam\\steamapps\\common\\counter-strike global offensive\\csgo\\bin\\client.dll',
  szModule: 'client.dll',
  th32ProcessID: 10316 } */

var value = processModule.modBaseAddr + offset;

// read memory (sync)
console.log("value of " + value + ": " + memoryjs.readMemory(value, "int"));

// read memory (async)
memoryjs.readMemory(value, "int", function (result) {
    console.log("value of " + value + ": " + result);
});

// write memory
memoryjs.writeMemory(value, 1, "int");