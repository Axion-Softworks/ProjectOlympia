using AutoMapper;

namespace ProjectOlympia
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AthleteCsvData, Athlete>()
                .ForCtorParam("medals", o => o.MapFrom(k => new List<Medal>()));

            CreateMap<AddUserRequest, User>();
            CreateMap<UpdateUserRequest, User>();
            CreateMap<AddDraftRequest, Draft>();
            CreateMap<UpdateDraftRequest, Draft>();
            CreateMap<UpdateAthleteRequest, Athlete>();
            CreateMap<AddMedalRequest, Medal>();
            CreateMap<UpdateMedalRequest, Medal>();

            CreateMap<Draft, DraftData>();
            CreateMap<User, UserData>();
            CreateMap<Medal, MedalData>();
            CreateMap<Athlete, AthleteData>();
        }
    }
}