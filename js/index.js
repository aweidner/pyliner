// Source: https://github.com/jagt/python-single-line-convert/blob/master/index.html
function inlineTransform(code) {
    var is_python3 = true

    var ix;
    var lines = code.trimRight() // keep left indent
                    .replace(/\\/g, '\\\\') //  escape all \
                    .replace(/"""/g, '\\"\\"\\"') // escape """
                    .split('\n');
    var first_indent;
    for (ix = 0; ix < lines.length; ++ix) {
        if (first_indent === undefined) {
            first_indent = lines[ix].match(/^\s*/);
        }
        lines[ix] = lines[ix].replace(new RegExp('^'+first_indent), '');
    }
    return lines.join('\n') + '\n';
}

function inlineRequirements(requirements) {
    return "pip3 install " + requirements.trimRight().split('\n').join(" ");
}

function execute(base64EncodedProgram) {
    program = `python3 -c 'exec("""import base64\\nexec(base64.b64decode("${base64EncodedProgram}").decode("utf-8"))""")'`

    return program
}

function createProgram(rawProgram) {
    return execute(btoa(inlineTransform(rawProgram)))
}

function getProgramOutputPart() {
    return execute(
        btoa(inlineTransform($("#programTxtArea").val())))
}

function getRequirementsPart() {
    return inlineRequirements($("#requirementsTxtArea").val())
}

var updateTextArea = throttle(function() {
    contents = getRequirementsPart() + " && " + getProgramOutputPart()
    $("#resultTxtArea").val(contents)
}, 100)

$("#requirementsTxtArea").on("paste keyup", updateTextArea)
$("#programTxtArea").on("paste keyup", updateTextArea)

$("#copyToClipboard").on("click", function() {
    $("#resultTxtArea").select()
    document.execCommand("copy")
    return false;
})

function throttle(f, throttleTimeout) {
    f.called = Date.now()
    if (!throttleTimeout || throttleTimeout < 0) {
        throttleTimeout = 1000
    }

    function callAfterDelay() {
        f.queuedCall = undefined 
        f.called = Date.now()
        f()
    }

    function shouldCall() {
        now = Date.now()
        if (f.queuedCall) {
            return
        }

        if (now - f.called >= throttleTimeout) {
            f.called = now 
            return f()
        } else {
            window.clearTimeout(f.queuedCall)
            f.queuedCall = window.setTimeout(callAfterDelay, throttleTimeout - (now - f.called))
        }
    }

    return shouldCall
}
