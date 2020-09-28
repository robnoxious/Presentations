import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import * as strings from 'SpFxHttpClientDemoWebPartStrings';
import SpFxHttpClientDemo from './components/SpFxHttpClientDemo';
import { ISpFxHttpClientDemoProps } from './components/ISpFxHttpClientDemoProps';
import { ICountryListItem } from '../../models';
import { sp } from "@pnp/sp/presets/all";
import { IItemAddResult } from "@pnp/sp/items";

export interface ISpFxHttpClientDemoWebPartProps {
  description: string;
}

export default class SpFxHttpClientDemoWebPart extends BaseClientSideWebPart<ISpFxHttpClientDemoWebPartProps> {
  private _countries: ICountryListItem[] = [];

  protected async onInit(): Promise<void> {
    await super.onInit();
    // other init code may be present
    sp.setup(this.context);
  }
  public render(): void {
    const element: React.ReactElement<ISpFxHttpClientDemoProps> = React.createElement(
      SpFxHttpClientDemo,
      {
        spListItems: this._countries,
        onGetListItems: this._onGetListItems,
        onAddListItem: this._onAddListItem,
        onUpdateListItem: this._onUpdateListItem,
        onDeleteListItem: this._onDeleteListItem
      }
    );

    ReactDom.render(element, this.domElement);
  }
  private _onGetListItems = (): void => {
    this._getListItems()
      .then(response => {
        this._countries = response;
        this.render();
      });
  }

  private _onAddListItem = (): void => {
    this._addListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._countries = response;
            this.render();
          });
      });
  }

  private _onUpdateListItem = (): void => {
    this._updateListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._countries = response;
            this.render();
          });
      });
  }

  private _onDeleteListItem = (): void => {
    this._deleteListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._countries = response;
            this.render();
          });
      });
  }

  private async _getListItems() {
    return await sp.web.lists.getByTitle("Countries").items.select("Title", "Id").get();
  }

  //private _getItemEntityType(): Promise<string> {
  // return this.context.spHttpClient.get(
  //   this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')?$select=ListItemEntityTypeFullName`,
  //   SPHttpClient.configurations.v1)
  //   .then(response => {
  //     return response.json();
  //   })
  //   .then(jsonResponse => {
  //     return jsonResponse.ListItemEntityTypeFullName;
  //   }) as Promise<string>;
  //}

  private async _addListItem() {
    return await sp.web.lists.getByTitle("Countries").items.add({
      Title: new Date().toUTCString()
    });
  }

  private async _updateListItem() {
    const items: any[] = await sp.web.lists.getByTitle("Countries").items.top(1).filter("Title eq 'United States'").get();
    if (items.length > 0) {
      const updatedItem = await sp.web.lists.getByTitle("Countries").items.getById(items[0].Id).update({
        Title: "USA",
      });
    }
    return
  }

  private async _deleteListItem() {
    // get the last item
    const items: any[] = await sp.web.lists.getByTitle("Countries").items.orderBy("Id", false).top(1).get();
    if (items.length > 0) {
      await sp.web.lists.getByTitle("Countries").items.getById(items[0].Id).delete();
    }
  }

  // private _getListItems(): Promise<ICountryListItem[]> {
  // 	return this.context.spHttpClient.get(
  // 		this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items?$select=Id,Title`,
  // 		SPHttpClient.configurations.v1)
  // 		.then(response => {
  // 			return response.json();
  // 		})
  // 		.then(jsonResponse => {
  // 			return jsonResponse.value;
  // 		}) as Promise<ICountryListItem[]>;
  // }

  // private _getItemEntityType(): Promise<string> {
  // 	return this.context.spHttpClient.get(
  // 		this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')?$select=ListItemEntityTypeFullName`,
  // 		SPHttpClient.configurations.v1)
  // 		.then(response => {
  // 			return response.json();
  // 		})
  // 		.then(jsonResponse => {
  // 			return jsonResponse.ListItemEntityTypeFullName;
  // 		}) as Promise<string>;
  // }

  // private _addListItem(): Promise<SPHttpClientResponse> {
  // 	return this._getItemEntityType()
  // 		.then(spEntityType => {
  // 			const request: any = {};
  // 			request.body = JSON.stringify({
  // 				Title: new Date().toUTCString(),
  // 				'@odata.type': spEntityType
  // 			});

  // 			return this.context.spHttpClient.post(
  // 				this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items`,
  // 				SPHttpClient.configurations.v1,
  // 				request);
  // 		}
  // 		);
  // }

  // private _updateListItem(): Promise<SPHttpClientResponse> {
  // 	// get the first item
  // 	return this.context.spHttpClient.get(
  // 		this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items?$select=Id,Title&$filter=Title eq 'United States'`,
  // 		SPHttpClient.configurations.v1)
  // 		.then(response => {
  // 			return response.json();
  // 		})
  // 		.then(jsonResponse => {
  // 			return jsonResponse.value[0];
  // 		})
  // 		.then((listItem: ICountryListItem) => {
  // 			// update item
  // 			listItem.Title = 'USA';
  // 			// save it
  // 			const request: any = {};
  // 			request.headers = {
  // 				'X-HTTP-Method': 'MERGE',
  // 				'IF-MATCH': (listItem as any)['@odata.etag']
  // 			};
  // 			request.body = JSON.stringify(listItem);

  // 			return this.context.spHttpClient.post(
  // 				this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items(${listItem.Id})`,
  // 				SPHttpClient.configurations.v1,
  // 				request);
  // 		});
  // }

  // private _deleteListItem(): Promise<SPHttpClientResponse> {
  // 	// get the last item
  // 	return this.context.spHttpClient.get(
  // 		this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items?$select=Id,Title&$orderby=ID desc&$top=1`,
  // 		SPHttpClient.configurations.v1)
  // 		.then(response => {
  // 			return response.json();
  // 		})
  // 		.then(jsonResponse => {
  // 			return jsonResponse.value[0];
  // 		})
  // 		.then((listItem: ICountryListItem) => {
  // 			const request: any = {};
  // 			request.headers = {
  // 				'X-HTTP-Method': 'DELETE',
  // 				'IF-MATCH': '*'
  // 			};
  // 			request.body = JSON.stringify(listItem);

  // 			return this.context.spHttpClient.post(
  // 				this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items(${listItem.Id})`,
  // 				SPHttpClient.configurations.v1,
  // 				request);
  // 		});
  // }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  // 	return Version.parse('1.0');
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
