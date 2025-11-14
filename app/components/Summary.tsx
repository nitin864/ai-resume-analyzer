 
import ScoreGauge from './ScoreGauge'

const Summary = ({ feedback}: {feedback: Feedback}) => {
  return (
    <div className='rouded-2xl bg-white shadow-md w-full'>
        <div className='flex flex-row p-4  items-center gap-8 '>
             <ScoreGauge score = {feedback.overallScore} />
             <div className='flex flex-col gap-2'>
                <h2 className='text-2xl font-bold'>Your Resume Score</h2>
                <p className='text-sm  text-gray-500'> 
                    These Scores Calculated Based on the variables listed Below..
                </p> 
             </div>
        </div>
        
    </div>
  )
}

export default Summary