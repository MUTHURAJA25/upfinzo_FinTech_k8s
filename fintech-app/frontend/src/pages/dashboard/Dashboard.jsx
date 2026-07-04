import React from 'react'
import Wrapper from '../layouts/Wrapper'

function Dashboard() {
  return (
   <Wrapper page="Overview">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome to Dashboard</h5>
              <p className="card-text">
                This is your main dashboard area. You can add your content here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default Dashboard