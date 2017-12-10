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

function inlineRequirements(requirements, pythonVersion) {
    return pythonVersion.pip + " install " + requirements.trimRight().split('\n').join(" ");
}

function execute(base64EncodedProgram, pythonVersion) {
    return pythonVersion.python + " -c '" + 
        pythonVersion.exec(
            '"""import base64\\n' +
            pythonVersion.exec(
                `base64.b64decode("${base64EncodedProgram}").decode("utf-8")`) + '"""') + "'"
}

function inlineProgram(rawProgram, pythonVersion) {
    return execute(btoa(inlineTransform(rawProgram)), pythonVersion)
}

function fromShell(shell) {
    if (shell === "bash") {
        return {
            "and": " && "
        }
    } else if (shell === "fish") {
        return {
            "and": "; and "
        }
    }
}

function fromPythonVersion(pythonVersion) {
    if (pythonVersion === "2") {
        return {
            "exec": function(code) { return  `exec ${code}` },
            "python": "python",
            "pip": "pip"
        }
    } else if (pythonVersion === "3") {
        return {
            "exec": function(code) { return `exec(${code})` },
            "python": "python3",
            "pip": "pip3"
        }
    }
}

function makeFullOneLiner(requirements, shell, program, pythonVersion) {
    if (!requirements) {
        return inlineProgram(program)
    }
    return inlineRequirements(requirements, fromPythonVersion(pythonVersion)) +
        fromShell(shell).and + inlineProgram(program, fromPythonVersion(pythonVersion))
}

function updateResult(program) {
    var oneLiner = makeFullOneLiner(
        $("#requirementsTxtArea").val(),
        $("#shellSelect").val(),
        $("#programTxtArea").next('.CodeMirror')[0].CodeMirror.getValue(),
        $("#pythonVersionSelect").val())
    $("#resultTxtArea").val(oneLiner)
    lastProgramValue = program
}

$("#requirementsTxtArea").on("paste keyup", updateResult)
$("#shellSelect").on("change", updateResult)
$("#pythonVersionSelect").on("change", updateResult)

$("#copyToClipboard").on("click", function() {
    $("#resultTxtArea").select()
    document.execCommand("copy")
    return false;
})
