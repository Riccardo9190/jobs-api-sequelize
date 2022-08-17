import { Request, Response } from 'express'
import { Company } from '../models'

export const companiesController = {
  
  // GET /companies
  index: async (req: Request, res: Response) => {

    try {
      const companies = await Company.findAll()
      return res.json(companies)

    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // POST /companies
  save: async (req: Request, res: Response) => {
    const { name, bio, website, email } = req.body

    try {
      const company = await Company.create({
        name,
        bio,
        website,
        email,
      })
      return res.status(201).json(company)

    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // GET /companies/:id
  show: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const company = await Company.findByPk(id, { include: 'jobs' })
      return res.json(company)
    
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // PUT /companies/:id
  update: async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, bio, website, email } = req.body

    try {
      // number of affected rows, number of updated companies (In this case, just one (position[0]))
      const [affectedRows, companies] = await Company.update({
        name,
        bio,
        website,
        email,
      }, {
        where: { id },
        returning: true 
      })

      return res.json(companies[0]) 
      
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  // DELETE /companies/:id
  delete: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      await Company.destroy({
        where: { id }
      })

      return res.status(204).send()
    
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  }
}