var QuickConnect = require('qcnode').QuickConnect,
step = require('step'),
fs = require('fs'),
qc = new QuickConnect

qc.isolate('step')
.command('example')
.dcf(function(data,qc){
    step(
      // Loads two files in parallel
      function loadStuff() {
        fs.readFile(__filename, this.parallel());
        fs.readFile("/etc/passwd", this.parallel());
      },
      // Show the result when done
      function showStuff(err, code, users) {
        if (err) throw err;
        console.log(code);
        console.log(users);
        qc.asyncStackContinue()
      }
    )
    return qc.WAIT_FOR_DATA
})

qc.run(['step','example'],{},{})