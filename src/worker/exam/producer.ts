import exampleQueue from './queue'

const addExamJob = async (exam: string) => {
  exampleQueue.add({ exam })
}

export default addExamJob
