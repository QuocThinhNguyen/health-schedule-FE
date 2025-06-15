const decreaseCredit   = async(id, count) =>{
    try{

        if(!id || count === undefined){
            throw new Bad("Loi khong co gia tri")
        }

        const user = await User.findById(id);
        if(!user){
            throw new Error("Loi khong ton tai user")
        }

        if(!user?.companyId){
            user.inMailCredit -= count;
            await user.save();
\
        }
        switch(user?.partyType):
            case:  partyType.COMPANY
                {
                    const company = await companyService.getCompanyByCompanyId(user.companyId);
                    if(!company) return null;
                    company.inMailCredit -= count;
                    await company.save();
                }

        return user;
    }catch{
        
    }

    
    
    
    
    // if(user?.partyType === partyType.COMPANY){
    //     const company = await companyService.getCompanyByCompanyId(user.companyId);
    //     if(!company) return null;
    //     company.inMailCredit -= count;
    //     await company.save();
    // }

    // return user;
}

const decreaseCredit1 = async (id, count) => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }
  if (user?.partyType === partyType.COMPANY && user?.companyId) {
    const company = await companyService.getCompanyByCompanyId(user.companyId);
    if (!company) return null;
    if (count !== undefined) {
      company.inMailCredit -= count;
    }
    await company.save();
  } else {
    if (count !== undefined) {
      user.inMailCredit -= count;
    }
    await user.save();
  }
  return user;
}