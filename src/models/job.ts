import { sequelize } from '../database'
import { BelongsToManyAddAssociationMixin, BelongsToManyCountAssociationsMixin, BelongsToManyRemoveAssociationMixin, DataTypes, Model } from 'sequelize'
import { CandidateInstance } from './candidate'

interface JobInstance extends Model {
  id: number
  title: string
  description: string
  limitDate: Date
  companyId: number
  
  // Method to add candidate in a job instance
  // BelongsToManyAddAssociationMixin --> Type to add many candidates on a Job
  // <CandidateInstance, number> --> The generics refer to: Instance to be associated / Primary key type of the instance to be associated
  addCandidate: BelongsToManyAddAssociationMixin<CandidateInstance, number>
  removeCandidate: BelongsToManyRemoveAssociationMixin<CandidateInstance, number>
  countCandidates: BelongsToManyCountAssociationsMixin
}

const Job = sequelize.define<JobInstance>(
  'jobs',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    limitDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    }
  }
)

export { Job }