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
  BadRequestException
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

// todo: look into validation: https://github.com/typestack/class-validator#custom-validation-classes

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: 'Get contact list' }) // todo: Search contacts
  @Get('list')
  getContactList(): Promise<IContact[]> {
    return this.contactService.getAll();
  }

  @ApiOperation({ summary: 'Get contact list' }) // todo: Search contacts
  @Get('search')
  searchContacts(@Param('options') options: any): Promise<ContactSearchResponse> {
    let results = this.contactService.search(options);
    return <ContactSearchResponse> {
      items = results,
      itemTotal = 0,
    }
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
