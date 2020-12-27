import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Response,
    Query,
    BadRequestException
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiOperation, ApiCreatedResponse, ApiResponse, ApiQuery, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import Contact from './contact';
import { ContactDto } from './dto/contact.dto';

// todo: look into validation: https://github.com/typestack/class-validator#custom-validation-classes

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: 'Get contact list' })
  @Get('list')
  getContactList(): Promise<Contact[]> {
    return this.contactService.getAll();
  }

  @ApiOperation({ summary: 'Get contact' })
  @ApiResponse({
      description: 'Contact',
      status: 201,
      //type: Contact // todo: resolve
    })
  @Get(':id')
  getContact(@Param('id') id: string): Promise<Contact> {
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
