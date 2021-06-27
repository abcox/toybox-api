import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Response,
  Query,
  BadRequestException,
  UseInterceptors,
  Request
} from '@nestjs/common';
import { ContactService } from './contact.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { IContact, ContactSearchResponse } from './interfaces/contact.interface';
import { ContactDto } from './dto/contact.dto';
import { AggregatePaginateResult } from 'mongoose';
import { LinkHeaderInterceptor, MongoPaginationParamDecorator, MongoPagination, Pageable } from '@algoan/nestjs-pagination';
import { inspect } from 'util'

const fs = require("fs");

// todo: look into validation: https://github.com/typestack/class-validator#custom-validation-classes

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get contact list' }) // todo: Search contacts
  //@ApiQuery({name: 'limit', required: false, explode: false, type: Number, isArray: false})
  getContactList(@Request() request: Request): Promise<IContact[]> {
    Logger.log(`list request: ${inspect(request.url)}`);
    const items = this.contactService.getAll();
    Logger.log(`list items: ${inspect(items)}`);
    return items;
  }

  // https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/
  // https://github.com/nestjsx/nestjs-typeorm-paginate
  // https://whatthecode.dev/nestjs-typeorm-pagination-step-by-step-guide/
  // https://medium.com/@chnirt/how-do-i-practice-with-nestjs-nestjs-typeorm-mongodb-9e407818a296 MongoRepository
  // https://eliezer.medium.com/typeorm-mongodb-review-8855903228b1
  // https://github.com/algoan/nestjs-components/tree/master/packages/pagination
  // https://slingshotlabs.io/blog/cursor-pagination-graphql-mongodb/

  //@UseInterceptors(new LinkHeaderInterceptor({ resource: 'search' }))
  @ApiOperation({ summary: 'Get contact list' }) // todo: Search contacts
  @ApiQuery({name: 'limit', required: false, explode: false, type: Number, isArray: false})
  @Get('search')
  //searchContacts(@Param('options') options: any): Promise<AggregatePaginateResult<IContact>> {
  async searchContacts(
    @Request() request: Request,
    @Query() query,
    //@MongoPaginationParamDecorator() pagination: MongoPagination
    ): Promise<{items: IContact[], totalItems: number}> {// Promise<AggregatePaginateResult<IContact>>
      //Logger.log(`search request: ${inspect(request)}`);
           
      /* const dir = await fs.promises.opendir("../logs");
      for await (const dirent of dir) {
        console.log(dirent.name);
      }
      fs.writeFile('../logs/api-log2.txt', inspect(request), 'ascii', (err) => { 
        if (err) throw err;
        console.log('The file has been saved!');
      }); */

      Logger.log(`search request url: ${inspect(request.url)}`);
      Logger.log(`search request query: ${inspect(query)}`);
      //Logger.log(`search pagination: ${inspect(pagination)}`);
      const data = await this.contactService.getAll2(query);
      //const data = this.contactService.getAll();
      //return this.contactService.search(pagination);  // TODO: finish impl. aggreg. & paginated..
      const count = await this.contactService.count();
      Logger.log(`search pagination count: ${count}`);
      const resp = { totalItems: count, items: data };
      //Logger.log(`search pagination: ${inspect(data)}`);
      //Logger.log(`search resp: ${inspect(resp)}`);
      return resp;
  }

  @ApiOperation({ summary: 'Get contact' })
  @ApiResponse({
      description: 'Contact',
      status: 201,
      //type: Contact // todo: resolve
    })
  @Get(':id')
  getContact(@Param('id') id: string): Promise<IContact> {
    const item = this.contactService.getById(id);
    if (!item) {
        throw new BadRequestException(`Contact not found for id = ${id}`);
    }
    return item;
  }
  
  @Post()
  @ApiOperation({ summary: 'Create contact' })
  @ApiCreatedResponse({
      description: 'Contact created',
      status: 201,
      //type: Contact // todo: resolve
    })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  public async createContact(@Response() res, @Body() contact: ContactDto) {
    Logger.log("creating contact: ", JSON.stringify(contact));    
    const result = await this.contactService.create(contact);
    return res.status(HttpStatus.OK).json(result);
  }  
  
  @Post("list")
  @ApiOperation({ summary: 'Create contacts' })
  @ApiBody({ type: [ContactDto] })
  public async importContacts(@Response() res, @Body() contactList: [ContactDto]) {
    let result = new Array<string>();
    await Promise.all(contactList.map(async contact => {
      const newContact = await this.contactService.create(contact);
      result.push(newContact.item.id);
    }));
    return res.status(HttpStatus.OK).json(result);
  }
  
  @Post("delete/list")
  @ApiOperation({ summary: 'Delete contacts' })
  @ApiBody({ type: [String] })
  public async deleteContacts(@Response() res, @Body() contactIdList: [string]) {
    let result = new Array<string>();
    for (const id of contactIdList) {
      const response = await this.contactService.delete(id);
      result.push(response.id);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiOperation({ summary: 'Delete contact' })
  @ApiResponse({ description: 'Contact deleted' })
  //@ApiQuery({ name: 'id', type: 'string' })
  @Delete(':id')
  public async deleteContact(@Param('id') id: string, @Response() res) {
      const result = await this.contactService.delete(id);
      return res.status(HttpStatus.OK).json(result);
  }
  
  @ApiOperation({ summary: 'Update contact' })
  @Patch(':id')
  public async updateTodo(@Param('id') id: string, @Response() res, @Body() contact: ContactDto) {
      const result = await this.contactService.update(id, contact);
      return res.status(HttpStatus.OK).json(result);
  }
}
