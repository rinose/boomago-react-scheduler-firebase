import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { withTranslation } from 'react-i18next';
import TableViewComponent from '../../../../components/TableViewComponent'
//import Autocomplete from '@material-ui/lab/Autocomplete';
//import TextField from '@material-ui/core/TextField';
//Actions
import {
  GetServices,
  UpdateServices,
  DeleteService
} from "../../../../helpers/db";


const schema= [
  { title: 'Nome', field: 'name', defaultSort: 'asc' },
  { title: 'Descrizione', field: 'description'},
  { title: 'Durata (minuti)', field: 'duration', type: 'numeric'},
  { 
    title: 'Categoria',
    field: 'category',
    /*editComponent: props => (
      <Autocomplete
      id="category"
      //options={categories.sort((a, b) => -b.title.localeCompare(a.title))}
      getOptionLabel={option => option.title}
      freeSolo
      renderInput={params => (
        <TextField {...params} 
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        label={"Category"}
        margin="normal" 
        variant="outlined" 
        fullWidth />
      )}
    />
    )*/
  },
  { title: 'Attivo', field: 'active', type: 'boolean', initialEditValue: true},
  { title: 'Prezzo', field: 'price', type: 'currency', currencySetting: {currencyCode: "EUR"} }
]

function ServicesManager (props) {

  const [services, setServices] = useState([]);
  const [updateServices, setUpdateServices] = useState(false)

  //const [categories, setCategories] = useState([]);

  const { t } = props;


  useEffect(() => {

    const getServices = (fromCache) => {
      let newServices = [];
      GetServices(props.sid, fromCache).then(querySnapshot => {
        //var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
        //console.log("Data came from " + source);
        //let newCategories = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          newServices.push(data);
          //if(data.category && !(data.category in newCategories)) {
          //  newCategories.push({"title": data.category});
          //}
        });
        setServices(newServices);
        //setCategories(newCategories);
      })
    }

    getServices(false);
  }, [props.sid, updateServices]);


  const setService = (service) => {
    UpdateServices(props.sid, service.id).set(service).then(
      setUpdateServices(!updateServices)
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }


  const onCreateService = (service) => {
    service.id = service.id ? service.id : uuidv4();
    setService(service);
  }


  const onEditService = (service) => {
    setService(service);
    //updateServices();
  }


  const onDeleteService = (service) => {
    DeleteService(props.sid, service.id).then(
      //updateServices()
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }

  return (
    <div>
      <div><strong>{t("Services")}</strong></div>
      <TableViewComponent
        onAdd={onCreateService}
        onEdit={onEditService}
        onDelete={onDeleteService}
        data={services}
        columns={schema}/>
    </div>
  )
}

export default withTranslation()(ServicesManager);
