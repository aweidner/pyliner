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
    assert.equal(inlineRequirements(requirementsTxtContents()), "pip3 install requests==1.10.0 btoa>=10.1 jinja2")
})

QUnit.test("can create entire runnable program", function(assert) {
    assert.equal(createProgram('print("hello world")'), runnableProgram())
})
