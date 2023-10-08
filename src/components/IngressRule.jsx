import React, { useState, useEffect } from 'react';
import styles from '../styles/IngressRule.module.css';
import TagForm from './TagForm';
import PushTagForm from './PushTagForm';

function IngressRule({ index, formValidity, formData, setFormData, currentIngressRule }) {
  const [tagAmount, setTagAmount] = useState(0);
  const [ingressRewrite, setIngressRewrite] = useState(false);
  const [egressRewrite, setEgressRewrite] = useState(false);
  const [pushTagsAmount, setPushTagsAmount] = useState(0);

  const [validity, setValidity] = useState({});

  const updateRule = (e) => {
    e.preventDefault();
    let { name, value } = e.target;

    switch (name) {
      case 'NAME':
        setFormData((current) => {
          const ingressRuleObj = current.INGRESS_RULES;
          ingressRuleObj[currentIngressRule][name] = value;
          return {
            ...current,
            INGRESS_RULES: ingressRuleObj,
          };
        });
        break;
      case 'PRIORITY':
        setFormData((current) => {
          const ingressRuleObj = current.INGRESS_RULES;
          ingressRuleObj[currentIngressRule][name] = parseInt(value);
          return {
            ...current,
            INGRESS_RULES: ingressRuleObj,
          };
        });
        break;
      case 'TYPE':
        if (value === 'TAGGED') {
          setTagAmount(1);
          // add tag table to formData
          setFormData({
            ...formData,
            INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, MATCH_CRITERIA: { ...rule.MATCH_CRITERIA, [name]: value, TAGS: [{ INDEX: 0, TYPE: 'c-vlan', VLAN_ID: '' }] } } : rule)),
          });
        } else {
          setTagAmount(0);
          let ingressrule = formData.INGRESS_RULES[currentIngressRule];
          delete ingressrule.MATCH_CRITERIA.TAGS;
          ingressrule.MATCH_CRITERIA.TYPE = value;
          setFormData({
            ...formData,
            INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...ingressrule } : rule)),
          });
        }

        break;
      case 'tagsNumber':
        const currentTags = formData.INGRESS_RULES[currentIngressRule].MATCH_CRITERIA.TAGS;
        let newValue = currentTags ? [...currentTags] : [];

        if (tagAmount <= value) {
          for (let i = tagAmount; i < value; i++) {
            newValue.push({
              INDEX: i,
              TYPE: 'c-vlan',
              VLAN_ID: '',
            });
          }
          setTagAmount(value);
        } else {
          setTagAmount(value);
          newValue = [newValue[value - 1]];
        }

        setFormData({
          ...formData,
          INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, MATCH_CRITERIA: { ...rule.MATCH_CRITERIA, TAGS: newValue } } : rule)),
        });
        break;
      case 'pop-tags':
        setFormData({
          ...formData,
          INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, REWRITE: { ...rule.REWRITE, POP_TAGS: [parseInt(value)] } } : rule)),
        });
        break;

      case 'pushTagsAmount':
        const currentPushTags = formData.INGRESS_RULES[currentIngressRule].REWRITE.PUSH_TAGS;
        let newPushTagsValue = currentPushTags ? [...currentPushTags] : [];

        if (pushTagsAmount <= value) {
          for (let i = pushTagsAmount; i < value; i++) {
            newPushTagsValue.push({
              TYPE: 'c-vlan',
              INDEX: i,
              VLAN_ID: '',
              WRITE_DEI0: '',
            });
          }
          setPushTagsAmount(value);
        } else {
          setPushTagsAmount(value);
          newPushTagsValue = [newPushTagsValue[value - 1]];
        }

        setFormData({
          ...formData,
          INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, REWRITE: { ...rule.REWRITE, PUSH_TAGS: newPushTagsValue } } : rule)),
        });
        break;

      default:
        break;
    }
  };

  const toggleIngressRewrite = () => {
    if (!ingressRewrite) {
      setFormData({
        ...formData,
        INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, REWRITE: { ...rule.REWRITE, POP_TAGS: [1] } } : rule)),
      });
    } else {
      let ingressrule = formData.INGRESS_RULES[currentIngressRule];

      // if PUSH_TAGS is set, delete only POP_TAGS
      // if PUSH_TAGS is not set, delete whole REWRITE object
      if (ingressrule.REWRITE && ingressrule.REWRITE.PUSH_TAGS) delete ingressrule.REWRITE.POP_TAGS;
      else delete ingressrule.REWRITE;

      setFormData({
        ...formData,
        INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...ingressrule } : rule)),
      });
    }

    setIngressRewrite(!ingressRewrite);
  };

  const toggleEgressRewrite = () => {
    if (!egressRewrite) {
      setFormData({
        ...formData,
        INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...rule, REWRITE: { ...rule.REWRITE, PUSH_TAGS: [{ TYPE: 'c-vlan', INDEX: 0, VLAN_ID: '', WRITE_DEI0: '' }] } } : rule)),
      });
    } else {
      let ingressrule = formData.INGRESS_RULES[currentIngressRule];

      // if POP_TAGS is set, delete only PUSH_TAGS
      // if POP_TAGS is not set, delete whole REWRITE object
      if (ingressrule.REWRITE && ingressrule.REWRITE.POP_TAGS) delete ingressrule.REWRITE.PUSH_TAGS;
      else delete ingressrule.REWRITE;

      setFormData({
        ...formData,
        INGRESS_RULES: formData.INGRESS_RULES.map((rule, index) => (index === currentIngressRule ? { ...ingressrule } : rule)),
      });
    }

    setEgressRewrite(!egressRewrite);
    setPushTagsAmount(1);
  };

  useEffect(() => {
    if (Object.keys(formValidity)?.length !== 0) {
      setValidity(formValidity?.INGRESS_RULES ? formValidity?.INGRESS_RULES[index] : {});
    }
  }, [formValidity, index]);

  return currentIngressRule === index ? (
    <div className={styles.container}>
      <div className="row">
        <div className="form-group col-md-4">
          {/*Input for NAME*/}
          <label htmlFor="ruleName">Rule name:</label>
          <input type="text" className={'form-control ' + validity.NAME} id="ruleName" name="NAME" value={formData.INGRESS_RULES[currentIngressRule].NAME} onChange={updateRule} />
          {validity?.nameError ? <div className="invalid-feedback">{validity?.nameError}</div> : null}
        </div>
        <div className="form-group col-md-4">
          {/*Input for PRIORITY*/}
          <label htmlFor="priority">Priority:</label>
          <input type="number" className={'form-control ' + validity.PRIORITY} id="priority" name="PRIORITY" value={formData.INGRESS_RULES[currentIngressRule].PRIORITY} onChange={updateRule} />
          {validity?.priorityError ? <div className="invalid-feedback">{validity?.priorityError}</div> : null}
        </div>
      </div>

      <div className="row mb-4">
        <div className="form-group col-md-4">
          {/*Input for TYPE*/}
          <label htmlFor="MATCH_CRITERIA_TYPE">TYPE:</label>
          <select className="form-control " id="MATCH_CRITERIA_TYPE" name="TYPE" value={formData.INGRESS_RULES[currentIngressRule].MATCH_CRITERIA.TYPE} onChange={updateRule}>
            <option value="TAGGED">TAGGED</option>
            <option value="UNTAGGED">UNTAGGED</option>
          </select>
        </div>

        {/* <div className="form-group"> */}
        {/*If TYPE is set to TAGGED user have to set amount of tags*/}
        {formData.INGRESS_RULES[currentIngressRule].MATCH_CRITERIA.TYPE === 'TAGGED' ? (
          <>
            <div className="col-md-4">
              <label htmlFor="tagsNumber">Number of Tags:</label>
              <select className="form-control " id="tagsNumber" name="tagsNumber" value={tagAmount} onChange={updateRule}>
                {/* <option>Select</option> */}
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </>
        ) : null}
      </div>
      {/*Depending on the user's choice, the appropriate number of forms for each tag is rendered*/}
      {formData.INGRESS_RULES[currentIngressRule].MATCH_CRITERIA.TYPE === 'TAGGED' ? (
        <div className="border p-3">
          <h5 className="mb-4">Tags Setup</h5>
          {formData.INGRESS_RULES[currentIngressRule].MATCH_CRITERIA.TAGS?.map((tag, index) => (
            <TagForm key={index} formValidity={validity} className="col-md-6" tag={tag} formData={formData} setFormData={setFormData} currentIngressRule={currentIngressRule} />
          ))}
        </div>
      ) : null}

      {/*Chceckbox ingress-rewrite*/}
      <div className="form-check mt-4 mb-2">
        <input className="form-check-input" type="checkbox" name="ingress-rewrite" checked={ingressRewrite} onChange={toggleIngressRewrite} id="ingress-rewrite" />
        <label className="form-check-label" htmlFor="ingress-rewrite">
          Ingress rewrite
        </label>
      </div>

      {/*If ingress-rewrite is checked, the form for ingress-rewrite is rendered*/}
      {ingressRewrite ? (
        <div className="row">
          <div className="col-md-4 mb-4">
            <label htmlFor="pop-tags">Pop tags:</label>
            <select className="form-control" id="pop-tags" name="pop-tags" value={formData.INGRESS_RULES[currentIngressRule].REWRITE.POP_TAGS[0]} onChange={updateRule}>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>
      ) : null}

      {/*Chceckbox egress-rewrite*/}
      <div className="form-check mt-4 mb-2">
        <input className="form-check-input" type="checkbox" name="egress-rewrite" checked={egressRewrite} onChange={toggleEgressRewrite} id="egress-rewrite" />
        <label className="form-check-label" htmlFor="egress-rewrite">
          Egress rewrite
        </label>
      </div>
      {/*If egress-rewrite is checked, the form for egress-rewrite is rendered*/}
      {egressRewrite ? (
        <div className="row col-md-4 mb-4">
          <label htmlFor="pushTagsAmount">Number of PUSH-TAGS:</label>
          <select className="form-control " id="pushTagsAmount" name="pushTagsAmount" value={pushTagsAmount} onChange={updateRule}>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      ) : null}

      {egressRewrite ? (
        <div className="border p-4">
          <h5 className="mb-4">PUSH-TAG Setup</h5>
          {/*Depending on the user's choice, the appropriate number of forms for each tag is rendered*/}
          {formData.INGRESS_RULES[currentIngressRule].REWRITE.PUSH_TAGS.map((tag, index) => (
            <PushTagForm key={index} formValidity={validity} tag={tag} formData={formData} setFormData={setFormData} currentIngressRule={currentIngressRule} />
          ))}
        </div>
      ) : null}
    </div>
  ) : null;
}

export default IngressRule;
