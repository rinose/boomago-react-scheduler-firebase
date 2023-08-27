import React, { Component } from 'react';
import uuidV4 from 'uuid/v4'
import { withTranslation } from 'react-i18next';
import TableViewComponent from '../../../../components/TableViewComponent'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
//Actions
import {
  GetServices,
  UpdateServices,
  DeleteService
} from "../../../../helpers/db";

class ServicesManager extends Component {

  constructor(props) {
    super(props)

    this.state = {
      services: []
    }
    this.schema = [];
    this.categories = [];
  }

  componentDidMount() {
    this.getServices(false);
  }

  setService(service) {
    UpdateServices(service.id).set(service).then(
      //this.updateServices()
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }

  onCreateService = (service) => {
    service.id = service.id ? service.id : uuidV4();
    this.setService(service);
  }
  onEditService = (service) => {
    this.setService(service);
    //this.updateServices();
  }
  onDeleteService = (service) => {
    DeleteService(service.id).then(
      //this.updateServices()
    ).catch(error => {
      console.error('Create New Equipment error', error);
    });
  }

  updateServices() {
    this.getServices(true);
  }
  getServices(fromCache) {
    let newServices = [];
    GetServices(fromCache).then(querySnapshot => {
      //var source = querySnapshot.metadata.fromCache ? "local cache" : "server";
      //console.log("Data came from " + source);
      this.categories = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        newServices.push(data);
        if(data.category && !(data.category in this.categories)) {
          this.categories.push({"title": data.category});
        }
      });
      this.initSchema();
      this.setState({
        services: newServices,
      })
    })
  }

  initSchema() {
    const { t } = this.props;
    this.schema= [
      { title: 'Nome', field: 'name', defaultSort: 'asc' },
      { title: 'Descrizione', field: 'description'},
      { title: 'Durata', field: 'duration', type: 'numeric'},
      { 
        title: 'Categoria',
        field: 'category',
        editComponent: props => (
          <Autocomplete
          id="category"
          options={this.categories.sort((a, b) => -b.title.localeCompare(a.title))}
          getOptionLabel={option => option.title}
          freeSolo
          renderInput={params => (
            <TextField {...params} 
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            label={t("Category")}
            margin="normal" 
            variant="outlined" 
            fullWidth />
          )}
        />
        )
      },
      { title: 'Attivo', field: 'active', type: 'boolean'},
      { title: 'Prezzo', field: 'price', type: 'currency', currencySetting: {currencyCode: "EUR"} }
    ]
  }

  render() {
    const { t } = this.props;
    const { services } = this.state;
    return (
      <div>
        <div><strong>{t("Services")}</strong></div>
        { (services.length > 0) &&
        <TableViewComponent
          onAdd={this.onCreateService}
          onEdit={this.onEditService}
          onDelete={this.onDeleteService}
          data={services}
          columns={this.schema}/>
        }
      </div>
    )
  }

}

export default withTranslation()(ServicesManager);
