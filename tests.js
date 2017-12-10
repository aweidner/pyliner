function getMultiLineStringForTest() {
    return `def SubFib(startNumber, endNumber):
    for cur in F():
        if cur > endNumber: return
        if cur >= startNumber:
            yield cur

for i in SubFib(10, 200):
    print i`;
}

function getMultiLineStringForTestAsOneLine() {
    return `def SubFib(startNumber, endNumber):\n    for cur in F():\n        if cur > endNumber: return\n        if cur >= startNumber:\n            yield cur\n\nfor i in SubFib(10, 200):\n    print i\n`
}

function requirementsTxtContents() {
    return `requests==1.10.0
btoa>=10.1
jinja2`
}

function runnableProgram() {
    return `python3 -c 'exec("""import base64\\nexec(base64.b64decode("cHJpbnQoImhlbGxvIHdvcmxkIikK").decode("utf-8"))""")'`
}

QUnit.test("does nothing", function(assert) {
    assert.ok(1 == "1", "Passed!");
})

QUnit.test("can single line a python expression", function(assert) {
    assert.equal(inlineTransform(getMultiLineStringForTest()), getMultiLineStringForTestAsOneLine())
})

QUnit.test("can convert contents of requirements.txt to single line", function(assert) {
    assert.equal(inlineRequirements(requirementsTxtContents(), fromPythonVersion("3")), "pip3 install requests==1.10.0 btoa>=10.1 jinja2")
})

QUnit.test("can create entire runnable program", function(assert) {
    assert.equal(inlineProgram('print("hello world")', fromPythonVersion("3")), runnableProgram())
})

QUnit.test("can get the right and for command from fish shell", function(assert) {
    assert.equal(fromShell("fish").and, "; and ")
})

QUnit.test("can get the right and for command from bash shell", function(assert) {
    assert.equal(fromShell("bash").and, " && ")
})

QUnit.test("can construct a full program with the fish shell", function(assert) {
    assert.equal(`pip3 install flask; and python3 -c 'exec("""import base64\\nexec(base64.b64decode("ZnJvbSBmbGFzayBpbXBvcnQgRmxhc2sKYXBwID0gRmxhc2soX19uYW1lX18pCgpAYXBwLnJvdXRlKCIvIikKZGVmIGhlbGxvKCk6CiAgICByZXR1cm4gIkhlbGxvIFdvcmxkISIKCmlmIF9fbmFtZV9fID09ICJfX21haW5fXyI6CiAgICBhcHAucnVuKCkK").decode("utf-8"))""")'`, makeFullOneLiner("flask", "fish", `from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()`, "3"))
})

QUnit.test("can construct a full python2 program with the fish shell", function(assert) {
    assert.equal(`pip install flask; and python -c 'exec """import base64\\nexec base64.b64decode("ZnJvbSBmbGFzayBpbXBvcnQgRmxhc2sKYXBwID0gRmxhc2soX19uYW1lX18pCgpAYXBwLnJvdXRlKCIvIikKZGVmIGhlbGxvKCk6CiAgICByZXR1cm4gIkhlbGxvIFdvcmxkISIKCmlmIF9fbmFtZV9fID09ICJfX21haW5fXyI6CiAgICBhcHAucnVuKCkK").decode("utf-8")"""'`, makeFullOneLiner("flask", "fish", `from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()`, "2"))
})
