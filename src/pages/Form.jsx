import React, { useState } from 'react';
import IngressRule from '../components/IngressRule';
import ModalRemoveRule from '../components/ModalRemoveRule';
function Form() {
  const [formData, setFormData] = useState({
    NAME: '',
    INTERFACE: '',
    INTERFACE_USAGE: '',
    INGRESS_RULES: [
      {
        NAME: 'New rule',
        PRIORITY: 1,
        MATCH_CRITERIA: {
          TYPE: 'UNTAGGED',
        },
      },
    ],
  });

  const [currentIngressRule, setCurrentIngressRule] = useState(0);
  const [ruleToRemove, setRuleToRemove] = useState('');

  const [showResult, setShowRestult] = useState(false);
  const [formValidity, setFormValidity] = useState({});
  const [ingressRuleError, setIngressRuleError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formValid = true;
    let formCopy = JSON.parse(JSON.stringify(formData));

    // validate NAME not empty
    if (formCopy.NAME !== '') {
      formCopy.NAME = 'is-valid';
    } else {
      formCopy.NAME = 'is-invalid';
      formCopy.nameError = 'Name cannot be empty';
      formValid = false;
    }
    // validate INTERFACE not empty
    if (formCopy.INTERFACE !== '') {
      formCopy.INTERFACE = 'is-valid';
    } else {
      formCopy.INTERFACE = 'is-invalid';
      formCopy.interfaceError = 'Interface cannot be empty';
      formValid = false;
    }

    // validate INGRESS_RULES

    let ingressRuleError = Array(formCopy.INGRESS_RULES.length).fill(false);

    formCopy.INGRESS_RULES.forEach((rule, index) => {
      // validate NAME not empty
      if (rule.NAME !== '') {
        formCopy.INGRESS_RULES[index].NAME = 'is-valid';
      } else {
        formCopy.INGRESS_RULES[index].NAME = 'is-invalid';
        ingressRuleError[index] = true;
        formCopy.INGRESS_RULES[index].nameError = 'Name cannot be empty';
        formValid = false;
      }
      // validate PRIORITY RANGE 1-2000
      if (rule.PRIORITY > 0 && rule.PRIORITY <= 2000) {
        formCopy.INGRESS_RULES[index].PRIORITY = 'is-valid';
      } else {
        formCopy.INGRESS_RULES[index].PRIORITY = 'is-invalid';
        ingressRuleError[index] = true;
        formCopy.INGRESS_RULES[index].priorityError = 'Priority must be between 1 and 2000';
        formValid = false;
      }

      // validate MATCH_CRITERIA.TAGS
      if (rule.MATCH_CRITERIA.TAGS?.length > 0) {
        rule.MATCH_CRITERIA.TAGS.forEach((tag, tagIndex) => {
          // validate VLAN_ID not empty
          if (tag.VLAN_ID !== '') {
            formCopy.INGRESS_RULES[index].MATCH_CRITERIA.TAGS[tagIndex].VLAN_ID = 'is-valid';
          } else {
            formCopy.INGRESS_RULES[index].MATCH_CRITERIA.TAGS[tagIndex].VLAN_ID = 'is-invalid';
            ingressRuleError[index] = true;
            formCopy.INGRESS_RULES[index].MATCH_CRITERIA.TAGS[tagIndex].vlan_IDError = 'Vlan ID cannot be empty';
            formValid = false;
          }
        });
      }
      // validate REWRITE.PUSH_TAGS
      if (rule.REWRITE?.PUSH_TAGS?.length > 0) {
        rule.REWRITE.PUSH_TAGS.forEach((tag, tagIndex) => {
          // validate VLAN_ID not empty
          if (tag.VLAN_ID !== '') {
            formCopy.INGRESS_RULES[index].REWRITE.PUSH_TAGS[tagIndex].VLAN_ID = 'is-valid';
          } else {
            formCopy.INGRESS_RULES[index].REWRITE.PUSH_TAGS[tagIndex].VLAN_ID = 'is-invalid';
            ingressRuleError[index] = true;
            formCopy.INGRESS_RULES[index].REWRITE.PUSH_TAGS[tagIndex].vlan_IDError = 'Vlan ID cannot be empty';
            formValid = false;
          }
        });
      }
    });

    setFormValidity(formCopy);
    setIngressRuleError(ingressRuleError);
    if (formValid) {
      // Remove INTERFACE_USAGE from formData because if it is empty it will be added to the output
      if (formData.INTERFACE_USAGE === '') {
        delete formData.INTERFACE_USAGE;
      }

      setShowRestult(true);
    }
    // setShowRestult(true);

    // Tutaj możesz wysłać dane na serwer lub wykonać inne działania z danymi formularza
  };

  const addNewRule = () => {
    setFormData({
      ...formData,
      INGRESS_RULES: [
        ...formData.INGRESS_RULES,
        {
          NAME: 'New rule',
          PRIORITY: 1,
          MATCH_CRITERIA: {
            TYPE: 'UNTAGGED',
          },
        },
      ],
    });
    setCurrentIngressRule(formData.INGRESS_RULES.length);
  };
  const removeRule = (ruleIndex) => {
    setFormData({
      ...formData,
      INGRESS_RULES: formData.INGRESS_RULES.filter((rule, index) => ruleIndex !== index),
    });
    setRuleToRemove('');
    setCurrentIngressRule(0);
  };

  return (
    <>
      {!showResult ? (
        <div className="container mt-5 p-4  rounded  bg-white ">
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <h2 className="mb-5 text-center">VLAN Subinterface</h2>
              <form onSubmit={handleSubmit}>
                {/* VLAN Subinterface input */}
                <div className="row mb-4">
                  <div className="form-group col-md-4">
                    <label htmlFor="vlanName">Name:</label>
                    <input type="text" className={'form-control ' + formValidity.NAME} id="vlanName" name="NAME" value={formData.NAME} onChange={handleChange} />
                    {formValidity.nameError ? <div className="invalid-feedback">{formValidity.nameError}</div> : null}
                  </div>
                  {/* interface input */}
                  <div className="form-group col-md-4">
                    <label htmlFor="interface">Interface:</label>
                    <input type="text" className={'form-control ' + formValidity.INTERFACE} id="interface" name="INTERFACE" value={formData.INTERFACE} onChange={handleChange} />
                    {formValidity.interfaceError ? <div className="invalid-feedback">{formValidity.interfaceError}</div> : null}
                  </div>
                  {/* interface usage input */}
                  <div className="form-group col-md-4">
                    <label htmlFor="interfaceUsage">Interface usage:</label>
                    <input type="text" className="form-control" id="interfaceUsage" name="INTERFACE_USAGE" value={formData.INTERFACE_USAGE} onChange={handleChange} />
                  </div>
                </div>

                {/* ingress_rules tabs */}
                <ul className="nav nav-tabs">
                  {formData.INGRESS_RULES.map((ingress_rule, index) => (
                    <li className="nav-item" key={index}>
                      <span>
                        <p className={`nav-link ${currentIngressRule === index ? 'active' : ''} ${ingressRuleError[index] ? 'ingressError' : ''}`} aria-current="page" onClick={() => setCurrentIngressRule(index)}>
                          {ingress_rule.NAME}
                          {formData.INGRESS_RULES.length > 1 ? (
                            <i
                              className="ml-2 bi bi-x-lg"
                              onClick={() => {
                                setRuleToRemove({ name: ingress_rule.NAME, index });
                              }}
                            ></i>
                          ) : null}
                        </p>
                      </span>
                    </li>
                  ))}
                  {/* add rule button */}
                  <li className="nav-item">
                    <p className="nav-link bg-success text-white" onClick={addNewRule}>
                      <i className="bi bi-plus-circle"></i> Add rule
                    </p>
                  </li>
                </ul>

                {/* Render component IngressRule for each rule */}
                {formData.INGRESS_RULES.map((ingress_rule, index) => (
                  <IngressRule key={index} index={index} formValidity={formValidity} formData={formData} setFormData={setFormData} currentIngressRule={currentIngressRule} />
                ))}

                {/* Modal confirm remove rule */}
                {ruleToRemove.name ? <ModalRemoveRule ruleToRemove={ruleToRemove} setRuleToRemove={setRuleToRemove} removeRule={removeRule} /> : null}

                {/* submit button */}
                <div className="row">
                  {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                  <div className="col-md-12 text-center">
                    <button type="submit" className="btn btn-success w-25 mt-3">
                      Create VLAN Subinterface
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      {showResult ? (
        <div className="container mt-5 p-4  rounded  bg-white ">
          <button className="btn btn-info mb-3" onClick={() => setShowRestult(false)}>
            Back to form
          </button>
          <h4>Output:</h4>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      ) : null}
    </>
  );
}

export default Form;
