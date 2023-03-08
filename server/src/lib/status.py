
class Status:
    max_iterations:int = 1
    cur_iteration:int = 0
    status:str = "Ready"

    @classmethod
    def start(self, num:int):
        if num == 0 :
            return
        Status.max_iterations = num
        Status.cur_iteration = 0
        Status.status = "Starting..."

    @classmethod
    def done(self):
        Status.cur_iteration = Status.max_iterations
        Status.status="Ready"

    @classmethod
    def updateIter(self, num:int):
        Status.cur_iteration = num

    @classmethod
    def updateStatus(self, msg:str):
        Status.status=msg
