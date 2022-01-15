import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgInput } from './dto/create-org.input';
import { Org } from './models/org.entity';
import { v4 as uuid } from 'uuid';
import { CurrentDateTime } from '../util/date.helpers';
import { LinkOrgField } from '../util/org.enum';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { RelationOrgToUsers } from './dto/relation-org-users.input';
import { LinkUsersOrgHelper } from './helper/link-users-to-org.helper';
import { UnlinkUsersOrgHelper } from './helper/unlink-users-from-org.helper';

@Injectable()
export class OrgService {
  private logger = new Logger('Org Service');

  constructor(
    @InjectRepository(Org) private orgRepository: Repository<Org>,
    private linkUsersOrgHelper: LinkUsersOrgHelper,
    private unlinkUsersOrgHelper: UnlinkUsersOrgHelper,
  ) {}

  async findOne(id: string): Promise<Org> {
    return this.orgRepository.findOne({ id });
  }

  async getOrgs(): Promise<Org[]> {
    const orgs: Org[] = await this.orgRepository.find();
    return orgs;
  }

  async createOrg(
    createOrgInput: CreateOrgInput,
    user: JwtPayload,
  ): Promise<Org> {
    const { orgName, owners, hopeCreators } = createOrgInput;

    const orgId: string = uuid();

    const org: Org = {
      _id: null,
      id: orgId,
      orgName,
      owners: await this.linkUsersOrgHelper.toField(
        orgId,
        owners,
        LinkOrgField.Owners,
      ),
      hopeCreators: await this.linkUsersOrgHelper.toField(
        orgId,
        hopeCreators,
        LinkOrgField.HopeCreators,
      ),
      enabled: true,
      createdBy: user.id,
      createdAt: CurrentDateTime(),
    };

    const createdOrg = this.orgRepository.create(org);
    return this.orgRepository.save(createdOrg);
  }

  async linkOrgToUsers(relationOrgToUsers: RelationOrgToUsers): Promise<Org> {
    const { orgId, owners, hopeCreators } = relationOrgToUsers;

    let orgToUpdate: Org = await this.findOne(orgId);
    if (!orgToUpdate) throw new Error(`Org "${orgId}" not found`);

    orgToUpdate = {
      ...orgToUpdate,
      owners: [
        ...orgToUpdate.owners,
        ...(await this.linkUsersOrgHelper.toField(
          orgId,
          owners,
          LinkOrgField.Owners,
        )),
      ],
      hopeCreators: [
        ...orgToUpdate.hopeCreators,
        ...(await this.linkUsersOrgHelper.toField(
          orgId,
          hopeCreators,
          LinkOrgField.HopeCreators,
        )),
      ],
    };

    return this.orgRepository.save(orgToUpdate);
  }

  async unlinkOrgFromUsers(
    relationOrgToUsers: RelationOrgToUsers,
  ): Promise<Org> {
    const { orgId, owners, hopeCreators } = relationOrgToUsers;

    let orgToUpdate: Org = await this.findOne(orgId);
    if (!orgToUpdate) throw new Error(`Org "${orgId}" not found`);

    orgToUpdate = await this.unlinkUsersOrgHelper.unlinkOwners(
      orgId,
      owners,
      orgToUpdate,
    );
    orgToUpdate = await this.unlinkUsersOrgHelper.unlinkHopeCreators(
      orgId,
      hopeCreators,
      orgToUpdate,
    );

    return this.orgRepository.save(orgToUpdate);
  }

  async getManyOrgs(orgIds: string[]): Promise<Org[]> {
    return this.orgRepository.find({
      where: {
        id: {
          $in: orgIds,
        },
      },
    });
  }
}
