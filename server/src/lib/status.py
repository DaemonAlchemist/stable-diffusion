
class Status:
    maxIterations:int = 1
    curIteration:int = 0
    status:str = "Ready"

    @classmethod
    def start(self, num:int):
        if num == 0 :
            return
        Status.maxIterations = num
        Status.curIteration = 0
        Status.status = "Starting..."

    @classmethod
    def done(self):
        Status.curIteration = Status.maxIterations
        Status.status="Ready"

    @classmethod
    def updateIter(self, num:int):
        Status.curIteration = num

    @classmethod
    def updateStatus(self, msg:str):
        Status.status=msg
