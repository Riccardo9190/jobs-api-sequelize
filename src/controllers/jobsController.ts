import { Request, Response } from 'express'
import { Job } from '../models'

const jobsController = {
  
  // GET /jobs
  index: async (req: Request, res: Response) => {

    try {
      const jobs = await Job.findAll({ include: 'company' })
      return res.json(jobs)

    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // POST /jobs  
  save: async (req: Request, res: Response) => {
    const { title, description, limitDate, companyId } = req.body

    try {
      const job = await Job.create({
        title,
        description,
        limitDate,
        companyId,
      })
      return res.status(201).json(job)
    
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // GET /jobs/:id
  show: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const job = await Job.findByPk(id, { include: ['company', 'candidates' ]})
      const candidatesCount = await job?.countCandidates() // Before count, analise if job exists (?)

      if (job === null) return res.status(404).json({ message: 'Vaga de emprego não encontrada' })
      
      return res.json({ ...job?.get(), candidatesCount }) // Adding candidatescount to job
      
      /* 
        'get()' will return just instantiated properties of the model, because since as we are using spread operator, it'll return methods (add, remove, count, etc) that can be used with models, 
        making unfeasible it conversion to json (where we just want table colummns)
      */
    
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // PUT /jobs/:id
  update: async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, description, limitDate, companyId } = req.body

    try {
      const [affectedRows, jobs] = await Job.update({
        title,
        description,
        limitDate,
        companyId,
      }, {
        where: { id },
        returning: true
      })

      return res.json(jobs[0])
    
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // DELETE /jobs/:id
  delete: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      await Job.destroy({
        where: { id: id }
      })

      return res.status(204).send()
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // POST /jobs/:id/addCandidate
  addCandidate: async (req: Request, res: Response) => {
    const jobId = req.params.id
    const { candidateId } = req.body

    try {
      const job = await Job.findByPk(jobId)

      if (job === null) return res.status(404).json({ message: 'Vaga de emprego não encontrada' })

      await job.addCandidate(candidateId)

      return res.status(201).send()
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // POST /jobs/:id/removeCandidate
  removeCandidate: async (req: Request, res: Response) => {
    const jobId = req.params.id
    const { candidateId } = req.body

    try {
      const job = await Job.findByPk(jobId)

      if (job === null) return res.status(404).json({ message: 'Vaga de emprego não encontrada' })

      await job.removeCandidate(candidateId)

      return res.status(204).send()
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },
}

export { jobsController }
