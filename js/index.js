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
    return `python3 -c 'exec("""import base64\\nexec(base64.b64decode("${base64EncodedProgram}").decode("utf-8"))""")'`
}

function inlineProgram(rawProgram) {
    return execute(btoa(inlineTransform(rawProgram)))
}

function fromShell(shell) {
    if (shell == "bash") {
        return {
            "and": " && "
        }
    } else if (shell == "fish") {
        return {
            "and": "; and "
        }
    }
}

function makeFullOneLiner(requirements, shell, program) {
    return inlineRequirements(requirements) + fromShell(shell).and + inlineProgram(program)
}

function updateResult(program) {
    var oneLiner = makeFullOneLiner(
        $("#requirementsTxtArea").val(),
        $("#shellSelect").val(),
        $("#programTxtArea").next('.CodeMirror')[0].CodeMirror.getValue())
    $("#resultTxtArea").val(oneLiner)
    lastProgramValue = program
}

$("#requirementsTxtArea").on("paste keyup", updateResult)
$("#shellSelect").on("change", updateResult)

$("#copyToClipboard").on("click", function() {
    $("#resultTxtArea").select()
    document.execCommand("copy")
    return false;
})
