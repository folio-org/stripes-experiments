import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'


const renderProvides = ({ fields }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Provides</button>
    </li>
    {fields.map((fld, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Provision"
          onClick={() => fields.remove(index)}/>
        <h4>Provision #{index + 1}</h4>
        <Field
          name={`${fld}.id`}
          type="text"
          component="input"
          placeholder="Module ID"/>
        <br/>
        <Field
          name={`${fld}.version`}
          type="text"
          component="input"
          placeholder="Version"/>
      </li>
    )}
  </ul>
)

const FieldArraysForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  console.log("provides: ",props.initialValues.provides);
  return (
    <form onSubmit={handleSubmit}>
      <Field name="name" type="text" component="input" />
      <FieldArray name="provides" component={renderProvides}/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'fieldArrays'     // a unique identifier for this form  
})(FieldArraysForm)
